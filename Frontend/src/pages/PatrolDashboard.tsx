"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";

import {
  MapPin,
  AlertTriangle,
  Camera,
  Search,
  Radio,
  Clock,
  Plus,
  Eye,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PatrolDashboard() {
  const navigate = useNavigate();

  // REPORT INCIDENT MODAL
  const [openReportModal, setOpenReportModal] = useState(false);

  // CASE SELECTION MODAL MODE: "upload" | "location" | null
  const [openCasesModal, setOpenCasesModal] = useState<null | "upload" | "location">(null);

  // UPLOAD PHOTO MODAL
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // LOCATION UPDATE MODAL
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  // STATES
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [newLocation, setNewLocation] = useState("");

  // Reset upload file when upload modal closes
  useEffect(() => {
    if (!openUploadModal) setUploadedFile(null);
  }, [openUploadModal]);

  // INCIDENT FORM STATE
  const [incidentForm, setIncidentForm] = useState({
    complainantName: "",
    complainantMobile: "",
    complainantAddress: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    incidentType: "",
    incidentDescription: "",
    victimName: "",
  });

  const handleChange = (e: any) => {
    setIncidentForm({ ...incidentForm, [e.target.name]: e.target.value });
  };

  const handleAddIncident = () => {
    console.log("Added Incident:", incidentForm);
    setOpenReportModal(false);
  };

  // STATIC DATA
  const activeAlerts = [
    { id: "ALT-001", type: "WANTED", suspect: "John Doe", location: "Downtown Plaza", priority: "HIGH", time: "5 mins ago" },
    { id: "ALT-002", type: "SUSPICIOUS", suspect: "Unknown Male", location: "Park Avenue", priority: "MEDIUM", time: "12 mins ago" },
    { id: "ALT-003", type: "BOLO", suspect: "Jane Smith", location: "Mall District", priority: "HIGH", time: "20 mins ago" },
  ];

  const recentIncidents = [
    { id: "INC-2024-156", type: "Suspicious Activity", location: "Main Street", status: "Reported", time: "1 hour ago" },
    { id: "INC-2024-155", type: "Traffic Violation", location: "Highway 101", status: "Resolved", time: "2 hours ago" },
    { id: "INC-2024-154", type: "Public Disturbance", location: "City Park", status: "Under Review", time: "3 hours ago" },
  ];

  const patrolStats = [
    { title: "Active Patrol", value: "On Duty", icon: Radio, color: "text-green-600" },
    { title: "Incidents Today", value: "8", icon: AlertTriangle, color: "text-blue-600" },
    { title: "Patrol Hours", value: "6.5h", icon: Clock, color: "text-primary" },
    { title: "Area Coverage", value: "Sector 7", icon: MapPin, color: "text-purple-600" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-destructive text-destructive-foreground";
      case "MEDIUM": return "bg-yellow-500 text-white";
      case "LOW": return "bg-green-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reported": return "bg-blue-500 text-white";
      case "Resolved": return "bg-green-500 text-white";
      case "Under Review": return "bg-yellow-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <Header />

      <main className="container mx-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patrol Dashboard</h1>
            <p className="text-muted-foreground">Field operations and incident management</p>
          </div>

          <Badge className="bg-primary text-primary-foreground px-4 py-2">
            <Radio className="w-4 h-4 mr-1" /> PATROL ACTIVE
          </Badge>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {patrolStats.map((stat) => (
            <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ---------------- QUICK ACTIONS + ALERTS ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ACTIVE ALERTS */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" /> Active Alerts
              </CardTitle>
              <CardDescription>Real-time alerts for your patrol area</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{alert.id}</Badge>
                      <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>

                  <p className="font-medium">{alert.type}: {alert.suspect}</p>

                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {alert.location}
                  </p>

                  <Button size="sm" className="mt-2 w-full">Respond to Alert</Button>
                </div>
              ))}

              <Button variant="outline" onClick={() => navigate("/case-reports")} className="w-full">View All Alerts</Button>
            </CardContent>
          </Card>

          {/* QUICK ACTIONS */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common patrol operations</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="grid grid-cols-2 gap-3">

                {/* REPORT INCIDENT */}
                <Button className="h-20 flex-col gap-2" onClick={() => setOpenReportModal(true)}>
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">Report Incident</span>
                </Button>

                {/* SUSPECT LOOKUP */}
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/criminal-records")}
                >
                  <Search className="w-6 h-6" />
                  <span className="text-sm">Suspect Lookup</span>
                </Button>

                {/* UPLOAD PHOTO */}
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => setOpenCasesModal("upload")}
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">Upload Photo</span>
                </Button>

                {/* LOG LOCATION */}
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => setOpenCasesModal("location")}
                >
                  <MapPin className="w-6 h-6" />
                  <span className="text-sm">Log Location</span>
                </Button>

              </div>

              <div className="pt-4 flex justify-between flex-col sm:flex-row gap-3 border-t">
                <Button onClick={() => navigate("/case-reports")} className="w-full bg-gradient-to-r from-primary to-primary-glow">
                  <Radio className="w-4 h-4 mr-2" /> View Cases
                </Button>
                <Button onClick={() => navigate("/criminal-records")} className="w-full bg-gradient-to-r from-primary to-primary-glow">
                  <Radio className="w-4 h-4 mr-2" /> Criminal Cases
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* -------------------- RECENT INCIDENTS -------------------- */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" /> Recent Incidents
            </CardTitle>
            <CardDescription>Your recent incident reports and responses</CardDescription>
          </CardHeader>

          <CardContent>
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-2">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{incident.id}</Badge>
                  <div>
                    <p className="font-medium">{incident.type}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {incident.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                  <span className="text-sm text-muted-foreground">{incident.time}</span>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full mt-4">View All Incidents</Button>
          </CardContent>
        </Card>


        {/* -------------------- REPORT INCIDENT MODAL -------------------- */}
        <Dialog open={openReportModal} onOpenChange={setOpenReportModal}>
          <DialogContent className="max-w-2xl h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Report New Incident</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">

              <div>
                <Label>Complainant Name</Label>
                <Input name="complainantName" value={incidentForm.complainantName} onChange={handleChange} />
              </div>

              <div>
                <Label>Complainant Mobile</Label>
                <Input name="complainantMobile" value={incidentForm.complainantMobile} onChange={handleChange} />
              </div>

              <div>
                <Label>Complainant Address</Label>
                <Input name="complainantAddress" value={incidentForm.complainantAddress} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Incident Date</Label>
                  <Input type="date" name="incidentDate" value={incidentForm.incidentDate} onChange={handleChange} />
                </div>

                <div>
                  <Label>Incident Time</Label>
                  <Input type="time" name="incidentTime" value={incidentForm.incidentTime} onChange={handleChange} />
                </div>
              </div>

              <div>
                <Label>Incident Location</Label>
                <Input name="incidentLocation" value={incidentForm.incidentLocation} onChange={handleChange} />
              </div>

              <div>
                <Label>Incident Type</Label>
                <Input name="incidentType" value={incidentForm.incidentType} onChange={handleChange} />
              </div>

              <div>
                <Label>Incident Description</Label>
                <Textarea name="incidentDescription" value={incidentForm.incidentDescription} onChange={handleChange} rows={4} />
              </div>

              <div>
                <Label>Victim Name</Label>
                <Input name="victimName" value={incidentForm.victimName} onChange={handleChange} />
              </div>

            </div>

            <DialogFooter>
              <Button className="w-full" onClick={handleAddIncident}>Add Incident</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        {/* -------------------- CASE SELECTION MODAL -------------------- */}
        <Dialog open={!!openCasesModal} onOpenChange={() => setOpenCasesModal(null)}>
          <DialogContent className="max-w-xl h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select a Case</DialogTitle>
            </DialogHeader>

            {/* SEARCH INPUT */}
            <div className="mb-4">
              <Input
                placeholder="Search by type, location, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* FILTERED RESULTS */}
            <div className="space-y-3">
              {recentIncidents
                .filter((incident) =>
                  `${incident.id} ${incident.type} ${incident.location}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-muted"
                    onClick={() => {
                      setSelectedCase(incident);

                      if (openCasesModal === "upload") {
                        setOpenCasesModal(null);
                        setOpenUploadModal(true);
                      }

                      if (openCasesModal === "location") {
                        setOpenCasesModal(null);
                        setOpenLocationModal(true);
                      }
                    }}
                  >
                    <p className="font-semibold">{incident.type}</p>
                    <p className="text-sm text-muted-foreground">{incident.location}</p>
                    <p className="text-xs text-muted-foreground">{incident.time}</p>
                  </div>
                ))}
                {openCasesModal === "upload" && <Button onClick={() => navigate("/case-reports")} className="w-full bg-gradient-to-r from-primary to-primary-glow">
                  <Radio className="w-4 h-4 mr-2" /> View Cases
                </Button>
                }
                {openCasesModal==="location" && <Button onClick={() => navigate("/criminal-records")} className="w-full bg-gradient-to-r from-primary to-primary-glow">
                  <Radio className="w-4 h-4 mr-2" /> Criminal Record
                </Button>}
            </div>
          </DialogContent>
        </Dialog>



        {/* -------------------- UPDATE LOCATION MODAL -------------------- */}
        <Dialog open={openLocationModal} onOpenChange={setOpenLocationModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Case Location</DialogTitle>
              {selectedCase && (
                <p className="text-sm text-muted-foreground">
                  {selectedCase.id} - {selectedCase.type}
                </p>
              )}
            </DialogHeader>

            <div className="space-y-4">
              <Label>New Location</Label>
              <Input
                placeholder="Enter updated location"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                className="w-full"
                onClick={() => {
                  if (!newLocation.trim()) return;

                  console.log("Updated location for:", selectedCase);
                  console.log("New Location:", newLocation);

                  setNewLocation("");
                  setSelectedCase(null);
                  setOpenLocationModal(false);
                }}
              >
                Update Location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
         {/* <Button onClick={() => navigate("/case-reports")} className="w-full bg-gradient-to-r from-primary to-primary-glow">
                  <Radio className="w-4 h-4 mr-2" /> View Cases
                </Button>
                <Button onClick={() => navigate("/criminal-records")} className="w-full bg-gradient-to-r from-primary to-primary-glow">
                  <Radio className="w-4 h-4 mr-2" /> Criminal Cases
                </Button> */}


        {/* -------------------- UPLOAD PHOTO MODAL -------------------- */}
        <Dialog open={openUploadModal} onOpenChange={setOpenUploadModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Photo for Case</DialogTitle>
              {selectedCase && (
                <p className="text-sm text-muted-foreground">
                  {selectedCase.id} - {selectedCase.type}
                </p>
              )}
            </DialogHeader>

            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
              />

              {uploadedFile && (
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-md border"
                />
              )}
            </div>

            <DialogFooter>
              <Button
                className="w-full"
                onClick={() => {
                  if (!uploadedFile) return;

                  console.log("Uploaded for:", selectedCase);
                  console.log("File:", uploadedFile);

                  setUploadedFile(null);
                  setSelectedCase(null);
                  setOpenUploadModal(false);
                }}
              >
                Upload Photo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}
