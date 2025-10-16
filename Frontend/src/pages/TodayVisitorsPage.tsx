"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import visitorService, { VisitorMeetingData } from "@/services/visitorService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function TodayVisitorsPage() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<VisitorMeetingData[]>([]);
  const [completedVisitors, setCompletedVisitors] = useState<VisitorMeetingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVisitor, setEditingVisitor] = useState<VisitorMeetingData | null>(null);
  const [cancelVisitor, setCancelVisitor] = useState<VisitorMeetingData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<VisitorMeetingData | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"today" | "upcoming" | "completed">("today");

  const today = new Date().toISOString().slice(0, 10);

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const scheduled = await visitorService.getAll();         // Scheduled visitors
      const completed = await visitorService.getCompleted();   // Completed visitors
      setCompletedVisitors(completed);

      let filtered = scheduled;
      if (filter === "today") {
        filtered = scheduled.filter(v => v.scheduledDate === today && v.status !== "Cancelled");
      } else if (filter === "upcoming") {
        filtered = scheduled.filter(v => v.scheduledDate > today && v.status !== "Cancelled");
      } else if (filter === "completed") {
        filtered = completed;
      }
      setVisitors(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, [filter]);

  const handleComplete = async (id?: number) => {
    if (!id) return;
    try {
      await visitorService.complete(id);

      // Remove from scheduled list immediately
      setVisitors(prev => prev.filter(v => v.id !== id));

      // Fetch updated completed list from backend
      const updatedCompleted = await visitorService.getCompleted();
      setCompletedVisitors(updatedCompleted);

      toast.success("Visitor marked as Completed");
    } catch (err) {
      console.error(err);
      toast.error("Error updating visitor status");
    }
  };

  const handleCancel = (visitor: VisitorMeetingData) => setCancelVisitor(visitor);

  const handleConfirmDelete = async () => {
    if (!confirmDelete?.id) return;
    try {
      await visitorService.delete(confirmDelete.id);
      toast.success("Visitor deleted successfully");
      setConfirmDelete(null);
      await loadVisitors();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting visitor");
    }
  };

  const handleEditSave = async () => {
    if (!editingVisitor || !editingVisitor.id) return;
    try {
      await visitorService.update(editingVisitor.id, editingVisitor);
      toast.success("Visitor rescheduled");
      setEditingVisitor(null);
      await loadVisitors();
    } catch (err) {
      console.error(err);
      toast.error("Error updating visitor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Visitors</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/")}>Dashboard</Button>
            <Button onClick={() => navigate("/visitor-data")}>All Visitors</Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Input
            placeholder="Search by name / inmate / purpose"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 md:mb-0"
          />

          <select
            className="border rounded p-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "today" | "upcoming" | "completed")}
          >
            <option value="today">Today's Visitors</option>
            <option value="upcoming">Upcoming Visitors</option>
            <option value="completed">Completed Visitors</option>
          </select>
        </div>

        {loading ? (
          <p>Loading visitors...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visitors
              .filter(v =>
                `${v.visitorName} ${v.inmateName} ${v.purpose}`.toLowerCase().includes(search.toLowerCase())
              )
              .map((v) => (
                <Card key={v.id} className="p-4">
                  <CardContent className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {v.visitorName} {v.visitorContact && `• ${v.visitorContact}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">Inmate: {v.inmateName}</p>
                      <p className="text-sm text-muted-foreground">Purpose: {v.purpose}</p>
                      <p className="text-sm text-muted-foreground">
                        {v.scheduledDate} • {v.scheduledTime}
                      </p>
                      {v.remarks && <p className="text-sm text-muted-foreground">Remarks: {v.remarks}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                      {v.status !== "Completed" && filter !== "completed" && (
                        <Button size="sm" onClick={() => handleComplete(v.id)}>Complete</Button>
                      )}
                      {filter !== "completed" && (
                        <Button size="sm" variant="destructive" onClick={() => handleCancel(v)}>
                          Cancel
                        </Button>
                      )}
                      {filter !== "completed" && (
                        <Button size="sm" variant="outline" onClick={() => setEditingVisitor(v)}>
                          Reschedule
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* ✅ Reschedule, Cancel, Confirm Delete dialogs remain unchanged */}
        {editingVisitor && (
          <Dialog open={!!editingVisitor} onOpenChange={() => setEditingVisitor(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reschedule Visitor</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <Label>Visitor Name</Label>
                <Input
                  value={editingVisitor.visitorName || ""}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, visitorName: e.target.value })}
                />
                <Label>Date</Label>
                <Input
                  type="date"
                  value={editingVisitor.scheduledDate || ""}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, scheduledDate: e.target.value })}
                />
                <Label>Time</Label>
                <Input
                  type="time"
                  value={editingVisitor.scheduledTime || ""}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, scheduledTime: e.target.value })}
                />
                <Label>Remarks</Label>
                <Input
                  value={editingVisitor.remarks || ""}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, remarks: e.target.value })}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button variant="ghost" onClick={() => setEditingVisitor(null)}>Cancel</Button>
                <Button onClick={handleEditSave}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {cancelVisitor && (
          <Dialog open={!!cancelVisitor} onOpenChange={() => setCancelVisitor(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Meeting</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Do you want to <strong>reschedule</strong> or <strong>delete</strong> this meeting?
              </p>
              <DialogFooter className="mt-4 flex justify-end gap-3">
                <Button onClick={() => { setEditingVisitor(cancelVisitor); setCancelVisitor(null); }}>
                  Reschedule
                </Button>
                <Button variant="destructive" onClick={() => { setConfirmDelete(cancelVisitor); setCancelVisitor(null); }}>
                  Delete
                </Button>
                <Button variant="ghost" onClick={() => setCancelVisitor(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {confirmDelete && (
          <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to permanently delete this visitor meeting?
              </p>
              <DialogFooter className="mt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setConfirmDelete(null)}>No</Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>Yes, Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
