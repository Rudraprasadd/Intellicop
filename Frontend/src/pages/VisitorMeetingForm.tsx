"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import visitorService from "../services/visitorService";
import { Calendar, User, Phone, FileText, Clock, XCircle } from "lucide-react";
import { Toaster, toast } from "@/components/ui/sonner";

export interface VisitorMeetingData {
  id?: number;
  visitorName: string;
  visitorContact: string;
  inmateName: string;
  purpose: string;
  scheduledDate: string;
  scheduledTime: string;
  remarks?: string;
  status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export default function VisitorMeetingForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (meeting: VisitorMeetingData) => void;
}) {
  const [form, setForm] = useState<VisitorMeetingData>({
    visitorName: "",
    visitorContact: "",
    inmateName: "",
    purpose: "",
    scheduledDate: "",
    scheduledTime: "",
    remarks: "",
    status: "SCHEDULED",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ----- VALIDATIONS -----
    // Contact number must be 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.visitorContact)) {
      alert("Enter a valid 10-digit contact number");
      return;
    }

    // Scheduled date must not be in the past
    const today = new Date().toISOString().slice(0, 10);
    if (form.scheduledDate < today) {
      toast.error("Enter a valid date. Date cannot be in the past.");
      return;
    }

    setLoading(true);
    try {
      // Ensure status is sent
      const payload = { ...form, status: "SCHEDULED" };

      const saved = await visitorService.schedule(payload);

      // Trigger parent handler to refresh dashboard list
      onSave(saved);

      // Close modal
      onClose();
    } catch (err) {
      console.error("Error scheduling meeting:", err);
      alert("Failed to schedule meeting. Please check console for errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl border border-border/40 bg-gradient-to-br from-background to-secondary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Schedule Visitor Meeting</CardTitle>
                <CardDescription>Fill in details to book a visitor appointment</CardDescription>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="hover:bg-destructive/10 text-destructive"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" /> Visitor Name
                  </label>
                  <Input
                    placeholder="Enter visitor name"
                    value={form.visitorName}
                    onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Contact Number
                  </label>
                  <Input
                    placeholder="Enter contact number"
                    value={form.visitorContact}
                    onChange={(e) => setForm({ ...form, visitorContact: e.target.value })}
                    required
                    maxLength={10}
                    pattern="\d{10}"
                    title="Enter a valid 10-digit number"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> Inmate Name
                </label>
                <Input
                  placeholder="Enter inmate name"
                  value={form.inmateName}
                  onChange={(e) => setForm({ ...form, inmateName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Purpose
                </label>
                <Input
                  placeholder="e.g., Legal Consultation, Family Visit"
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Date
                  </label>
                  <Input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Time
                  </label>
                  <Input
                    type="time"
                    value={form.scheduledTime}
                    onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Remarks (optional)
                </label>
                <Textarea
                  placeholder="Add any additional notes or instructions"
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Scheduling..." : "Confirm Meeting"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
