"use client";

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import visitorService, { VisitorMeetingData } from "@/services/visitorService";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function VisitorDataPage() {
  const navigate = useNavigate();
  const [allVisitors, setAllVisitors] = useState<VisitorMeetingData[]>([]);
  const [completedVisitors, setCompletedVisitors] = useState<VisitorMeetingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVisitor, setEditingVisitor] = useState<VisitorMeetingData | null>(null);

  const [filter, setFilter] = useState<"All" | "ScheduledToday" | "CompletedToday" | "Upcoming">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (filter === "CompletedToday") {
      loadCompleted();
    }
  }, [filter]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await visitorService.getAll();
      setAllVisitors(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch visitor data");
    } finally {
      setLoading(false);
    }
  };

  const loadCompleted = async () => {
    setLoading(true);
    try {
      const data = await visitorService.getCompleted();
      setCompletedVisitors(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch completed visitor data");
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic (except CompletedToday)
  const filteredVisitors = useMemo(() => {
    if (filter === "CompletedToday") {
      return completedVisitors;
    }

    return allVisitors.filter((v) => {
      if (
        search &&
        !`${v.visitorName} ${v.inmateName} ${v.purpose}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;

      switch (filter) {
        case "All":
          return true;
        case "ScheduledToday":
          return (
            v.scheduledDate === today &&
            v.status !== "CANCELLED" &&
            v.status !== "COMPLETED"
          );
        case "Upcoming":
          return v.scheduledDate > today && v.status !== "CANCELLED";
        default:
          return true;
      }
    });
  }, [allVisitors, completedVisitors, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredVisitors.length / pageSize));
  const pageItems = filteredVisitors.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this visitor record?")) return;
    try {
      await visitorService.delete(id);
      await load();
      toast.success("Visitor record deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting visitor record");
    }
  };

  const handleEditSave = async () => {
    if (!editingVisitor || !editingVisitor.id) return;
    try {
      await visitorService.update(editingVisitor.id, editingVisitor);
      setEditingVisitor(null);
      await load();
      toast.success("Visitor updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error updating visitor");
    }
  };

  const goBack = () => navigate(-1);

  const getVisitorStatus = (v: VisitorMeetingData) => {
    if (v.status === "CANCELLED") return "Cancelled";
    if (v.status === "Completed") return "Completed";
    if (v.scheduledDate === today) return "Scheduled";
    if (v.scheduledDate > today) return "Upcoming";
    return "Scheduled";
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Visitor Data</h1>
            <p className="text-muted-foreground">
              Full list of visitor meetings — update or delete visitor records.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={goBack}>
              Back
            </Button>
            <Button onClick={() => navigate("/")}>Dashboard</Button>
          </div>
        </div>

        <Card className="mb-4">
          <CardContent className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex gap-2 pt-4">
              {["All", "ScheduledToday", "CompletedToday", "Upcoming"].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  onClick={() => {
                    setFilter(f as any);
                    setPage(1);
                  }}
                >
                  {f === "All"
                    ? "All"
                    : f === "ScheduledToday"
                    ? "Scheduled Today"
                    : f === "CompletedToday"
                    ? "Completed"
                    : "Upcoming"}
                </Button>
              ))}
            </div>

            <div className="flex-1 pt-4">
              <Input
                placeholder="Search by name / inmate / purpose"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <p>Loading...</p>
        ) : filteredVisitors.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">
            No visitors found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageItems.map((v) => (
                <Card key={v.id} className="p-4">
                  <CardContent className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-xl">
                        Visitor: {v.visitorName}{" "}
                        {v.visitorContact ? `• ${v.visitorContact}` : ""}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Inmate: {v.inmateName} <br /> Reason: {v.purpose}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {v.scheduledDate} • {v.scheduledTime}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                        getVisitorStatus(v)
                      )}`}
                    >
                      {getVisitorStatus(v)}
                    </span>
                  </CardContent>

                  {filter!="CompletedToday" &&  <div className="flex gap-2 mt-2">

                   <Button size="sm" variant="ghost" onClick={() => setEditingVisitor(v)}>
                      <Edit className="w-4 h-4 mr-1 inline" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(v.id)}>
                      <Trash2 className="w-4 h-4 mr-1 inline" /> Delete
                    </Button>
                  </div>}
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <p>
                Page {page} of {totalPages}
              </p>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}

        {editingVisitor && (
          <Dialog open={!!editingVisitor} onOpenChange={() => setEditingVisitor(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Visitor Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                {[
                  ["Visitor Name", "visitorName"],
                  ["Visitor Contact", "visitorContact"],
                  ["Inmate Name", "inmateName"],
                  ["Purpose", "purpose"],
                  ["Date", "scheduledDate", "date"],
                  ["Time", "scheduledTime", "time"],
                  ["Remarks", "remarks"],
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      type={type || "text"}
                      value={(editingVisitor as any)[key] || ""}
                      onChange={(e) =>
                        setEditingVisitor({
                          ...editingVisitor,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <DialogFooter className="mt-4">
                <Button variant="ghost" onClick={() => setEditingVisitor(null)}>
                  Cancel
                </Button>
                <Button onClick={handleEditSave}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
