// DeskDashboard.tsx (only show updated/added parts — replace your file with this full version)
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { FileText, Users, UserPlus, Upload, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CriminalForm, { CriminalFormData } from "./CriminalForm";
import { criminalService } from "@/services/criminalService";
import VisitorMeetingForm, { VisitorMeetingData } from "./VisitorMeetingForm";
import visitorService from "@/services/visitorService"; // added

export default function DeskDashboard() {
  const navigate = useNavigate();

  /** ---------- STATE ---------- **/
  const [suspects, setSuspects] = useState<CriminalFormData[]>([]);
  const [filteredSuspects, setFilteredSuspects] = useState<CriminalFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCriminalForm, setShowCriminalForm] = useState(false);
  const [editingCriminal, setEditingCriminal] = useState<CriminalFormData | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Visitor meeting modal
  const [showVisitorForm, setShowVisitorForm] = useState(false);

  // visitors state
  const [visitors, setVisitors] = useState<VisitorMeetingData[]>([]);
  const [scheduledToday, setScheduledToday] = useState<VisitorMeetingData[]>([]);
  const [upcoming, setUpcoming] = useState<VisitorMeetingData[]>([]);
  const [completedToday, setCompletedToday] = useState<VisitorMeetingData[]>([]);
  const [visitorLoading, setVisitorLoading] = useState(true);

  // Today's Visitor Log pagination (limit 3)
  const [visitorPage, setVisitorPage] = useState(1);
  const visitorLimit = 3;
  const totalVisitorPages = Math.max(1, Math.ceil(scheduledToday.length / visitorLimit));

  // Pagination for criminals
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  /** ---------- DUMMY DATA ---------- **/
  const pendingCases = [
    { id: "FIR-2024-089", type: "Theft", complainant: "Sarah Johnson", priority: "MEDIUM", time: "30 mins ago" },
    { id: "FIR-2024-090", type: "Assault", complainant: "Michael Chen", priority: "HIGH", time: "1 hour ago" },
    { id: "FIR-2024-091", type: "Fraud", complainant: "David Wilson", priority: "LOW", time: "2 hours ago" },
  ];

  const recentVisitors = [
    { name: "Emma Davis", purpose: "Meeting Inmate #1247", time: "10:30 AM", status: "Cleared" },
    { name: "Robert Brown", purpose: "Legal Consultation", time: "11:15 AM", status: "In Progress" },
    { name: "Lisa Anderson", purpose: "Document Submission", time: "12:00 PM", status: "Pending" },
  ];

  const todayStats = [
    { title: "Cases Registered", value: "12", icon: FileText, color: "text-blue-600" },
    { title: "Visitors Today", value: "28", icon: Users, color: "text-green-600" },
    { title: "Pending Reviews", value: "7", icon: Clock, color: "text-yellow-600" },
    { title: "Documents Processed", value: "45", icon: Upload, color: "text-primary" },
  ];

  /** ---------- EFFECTS ---------- **/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await criminalService.getAll();
        setSuspects(data);
      } catch (err) {
        console.error("Error fetching criminals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // fetch visitors
  useEffect(() => {
    const loadVisitors = async () => {
      setVisitorLoading(true);
      try {
        const all: VisitorMeetingData[] = await visitorService.getAll();
        setVisitors(all);

        // compute today's date in yyyy-mm-dd (local)
        const today = new Date().toISOString().slice(0, 10);

        const scheduled = all.filter(v => v.status !== "CANCELLED" && v.scheduledDate === today && v.status !== "COMPLETED");
        const compToday = all.filter(v => v.status === "COMPLETED" && v.scheduledDate === today);
        const up = all.filter(v => v.scheduledDate > today && v.status !== "CANCELLED");

        // sort each list by time ascending
        const sortByTime = (arr: VisitorMeetingData[]) =>
          arr.sort((a, b) => (a.scheduledTime || "").localeCompare(b.scheduledTime || ""));

        setScheduledToday(sortByTime(scheduled));
        setCompletedToday(sortByTime(compToday));
        setUpcoming(sortByTime(up));
      } catch (err) {
        console.error("Error fetching visitors:", err);
      } finally {
        setVisitorLoading(false);
      }
    };
    loadVisitors();
  }, [showVisitorForm]); // reload when modal closes (new meeting scheduled)

  useEffect(() => {
    if (!searchQuery) {
      setFilteredSuspects(suspects);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredSuspects(
        suspects.filter(
          s => s.name.toLowerCase().includes(query) || s.crime.toLowerCase().includes(query)
        )
      );
    }
    setCurrentPage(1);
  }, [searchQuery, suspects]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  /** ---------- HELPERS ---------- **/
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-destructive text-destructive-foreground";
      case "MEDIUM": return "bg-yellow-500 text-white";
      case "LOW": return "bg-green-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getVisitorStatusColor = (status: string) => {
    switch (status) {
      case "Cleared": return "bg-green-500 text-white";
      case "In Progress": return "bg-blue-500 text-white";
      case "Pending": return "bg-yellow-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredSuspects.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSuspects.length / recordsPerPage) || 1;

  /** ---------- CRUD HANDLERS (criminals) ---------- **/
  const handleSaveCriminal = async (criminal: CriminalFormData) => {
    try {
      let savedCriminal: CriminalFormData;
      const formData = new FormData();
      formData.append(
        "criminal",
        new Blob([JSON.stringify({
          name: criminal.name,
          age: criminal.age,
          crime: criminal.crime,
          threat: criminal.threat,
          lastSeen: criminal.lastSeen,
          status: criminal.status,
          record: criminal.record,
        })], { type: "application/json" })
      );
      if (criminal.photo instanceof File) formData.append("photoFile", criminal.photo);

      if (criminal.id) {
        const response = await fetch(`http://localhost:8081/api/criminals/${criminal.id}`, {
          method: "PUT", body: formData
        });
        savedCriminal = await response.json();
        setSuspects(prev => prev.map(c => c.id === savedCriminal.id ? savedCriminal : c));
        setAlertMessage("Criminal updated successfully!");
      } else {
        const response = await fetch("http://localhost:8081/api/criminals", { method: "POST", body: formData });
        savedCriminal = await response.json();
        setSuspects(prev => [...prev, savedCriminal]);
        setAlertMessage("Criminal added successfully!");
      }
    } catch (err) {
      console.error(err);
      setAlertMessage("Error saving criminal");
    } finally {
      setShowCriminalForm(false);
      setEditingCriminal(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this criminal?")) return;
    try {
      await fetch(`http://localhost:8081/api/criminals/${id}`, { method: "DELETE" });
      setSuspects(prev => prev.filter(c => c.id !== id));
      setAlertMessage("Criminal deleted successfully!");
    } catch (err) {
      console.error(err);
      setAlertMessage("Error deleting criminal");
    }
  };

  // Visitor meeting save handler
  // Visitor meeting save handler
    const handleSaveVisitorMeeting = async (meeting: VisitorMeetingData) => {
      try {
        // Call backend to save the meeting
        if (meeting) {
          await visitorService.schedule(meeting);
          setAlertMessage("Visitor meeting scheduled successfully!");
        }
      } catch (err) {
        console.error("Error scheduling visitor meeting:", err);
        setAlertMessage("Error scheduling visitor meeting");
      } finally {
        setShowVisitorForm(false); // close modal
        // Reload visitors is already handled by useEffect watching showVisitorForm
      }
    };


  // navigate to full visitor data page
  const openVisitorData = () => {
    navigate("/visitor-data");
  };

  // quick actions for visitor: check-in / complete / cancel (in dashboard we show only scheduled today list)
  const handleVisitorAction = async (id: number, action: "checkin" | "complete" | "cancel") => {
    try {
      if (action === "checkin") await visitorService.checkin(id);
      if (action === "complete") await visitorService.complete(id);
      if (action === "cancel") await visitorService.cancel(id);

      // refresh visitors
      const all = await visitorService.getAll();
      setVisitors(all);
      // recompute scheduledToday/upcoming in same logic as effect
      const today = new Date().toISOString().slice(0, 10);
      setScheduledToday(all.filter(v => v.status !== "Cancelled" && v.scheduledDate === today && v.status !== "Completed"));
      setCompletedToday(all.filter(v => v.status === "Completed" && v.scheduledDate === today));
      setUpcoming(all.filter(v => v.scheduledDate > today && v.status !== "Cancelled"));
      setAlertMessage(`Visitor ${action} successful`);
    } catch (err) {
      console.error(err);
      setAlertMessage(`Error performing ${action}`);
    }
  };

  /** ---------- RENDER ---------- **/
  if (loading) return <p className="text-center mt-10">Loading criminal records...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />

      <main className="container mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Desk Officer Dashboard</h1>
            <p className="text-muted-foreground">Case management and administrative operations</p>
          </div>
          <Badge className="bg-secondary text-secondary-foreground px-4 py-2">
            <FileText className="w-4 h-4 mr-1" /> DESK DUTY
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {todayStats.map(stat => (
            <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Cases */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" /> Pending Case Registration
              </CardTitle>
              <CardDescription>FIRs and complaints awaiting processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingCases.map(case_item => (
                <div key={case_item.id} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{case_item.id}</Badge>
                      <Badge className={getPriorityColor(case_item.priority)}>{case_item.priority}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{case_item.time}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{case_item.type}</p>
                    <p className="text-sm text-muted-foreground">Complainant: {case_item.complainant}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">Process Case</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">View All Pending Cases</Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common desk operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-20 flex-col gap-2">
                  <FileText className="w-6 h-6" /> <span className="text-sm">Register FIR</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => { setEditingCriminal(null); setShowCriminalForm(true); }}
                >
                  <UserPlus className="w-6 h-6" /> <span className="text-sm">Add Criminal</span>
                </Button>
                <Button className="h-20 flex-col gap-2" onClick={() => navigate("/Today-Visitors")}>
                  <Users className="w-6 h-6" /> <span className="text-sm">Visitor Check-in</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/criminal-records")}
                >
                  <Upload className="w-6 h-6" /> <span className="text-sm">Update Criminal</span>
                </Button>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => setShowVisitorForm(true)}>
                    <Calendar className="w-4 h-4 mr-2" /> Schedule Visitor Meeting
                  </Button>
                  <Button className="w-full" onClick={() => navigate("/visitor-data")}>
                    <Users className="w-4 h-4 mr-2" /> Visitor Data
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" /> Assign Case to Officer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Management */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Today's Visitor Log
            </CardTitle>
            <CardDescription>Visitors scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            {visitorLoading ? (
              <p>Loading visitors...</p>
            ) : (
              <>
                {scheduledToday.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No visitors scheduled for today.
                  </p>
                ) : (
                  <>
                    {scheduledToday
                      .slice((visitorPage - 1) * visitorLimit, visitorPage * visitorLimit)
                      .map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-2"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{v.visitorName}</p>
                              <p className="text-sm text-muted-foreground">
                                {v.purpose} • {v.scheduledTime}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              v.status === "COMPLETED"
                                ? "bg-green-500 text-white"
                                : v.status === "SCHEDULED"
                                ? "bg-yellow-500 text-white"
                                : "bg-blue-500 text-white"
                            }
                          >
                            {v.status}
                          </Badge>
                        </div>
                      ))}

                    {/* Pagination for today's visitors */}
                    <div className="flex items-center justify-between mt-2">
                      <Button
                        size="sm"
                        onClick={() => setVisitorPage((p) => Math.max(1, p - 1))}
                        disabled={visitorPage === 1}
                      >
                        Prev
                      </Button>
                      <p>
                        Page {visitorPage} of {totalVisitorPages}
                      </p>
                      <Button
                        size="sm"
                        onClick={() =>
                          setVisitorPage((p) => Math.min(totalVisitorPages, p + 1))
                        }
                        disabled={visitorPage === totalVisitorPages}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>


        {/* Criminal Records Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Criminal Records</CardTitle>
            <CardDescription>Manage criminal profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              placeholder="Search by name or crime..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentRecords.map(criminal => (
                <Card key={criminal.id} className="shadow hover:shadow-lg">
                  <img
                    src={criminal.photo?.toString() || "/images/default-criminal.jpg"}
                    alt={criminal.name}
                    className="h-40 w-full object-cover rounded-t-lg"
                  />
                  <CardContent className="space-y-2">
                    <p className="font-bold">{criminal.name}</p>
                    <p className="text-sm text-muted-foreground">{criminal.crime}</p>
                    <p className="text-sm">Status: {criminal.status}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => { setEditingCriminal(criminal); setShowCriminalForm(true); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(criminal.id!)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <p>Page {currentPage} of {totalPages}</p>
              <Button
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* ---------- ADD/EDIT CRIMINAL MODAL ---------- */}
      <AnimatePresence>
        {showCriminalForm && (
          <CriminalForm
            criminal={editingCriminal || undefined}
            onClose={() => setShowCriminalForm(false)}
            onSave={handleSaveCriminal}
          />
        )}
      </AnimatePresence>

      {/* ---------- VISITOR MEETING MODAL ---------- */}
      <AnimatePresence>
        {showVisitorForm && (
          <VisitorMeetingForm
            onClose={() => setShowVisitorForm(false)}
            onSave={handleSaveVisitorMeeting}
          />
        )}
      </AnimatePresence>

      {/* ---------- ALERT TOAST ---------- */}
      {alertMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
        >
          {alertMessage}
        </motion.div>
      )}
    </div>
  );
}
