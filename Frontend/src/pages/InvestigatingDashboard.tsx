"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Search, FileText, Users, Target, CheckCircle, Clock, Gavel, Link } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { criminalService } from "@/services/criminalService";

interface CriminalFormData {
  id?: number;
  name: string;
  age?: number;
  crime?: string;
  threat?: string;
  lastSeen?: string;
  status?: string;
  photo?: string;
}

export default function InvestigatingDashboard() {
  const navigate = useNavigate();

  const assignedCases = [
    { id: "CASE-2024-078", title: "Armed Robbery Investigation", suspects: 3, status: "Active", priority: "HIGH", progress: 75 },
    { id: "CASE-2024-079", title: "Financial Fraud Analysis", suspects: 2, status: "Active", priority: "MEDIUM", progress: 45 },
    { id: "CASE-2024-080", title: "Drug Distribution Ring", suspects: 8, status: "Review", priority: "HIGH", progress: 90 },
  ];

  // ---------------- Active Suspect Profiles ----------------
  const [suspects, setSuspects] = useState<CriminalFormData[]>([]);
  const [activeSuspectsCount, setActiveSuspectsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSuspect, setSelectedSuspect] = useState<CriminalFormData | null>(null);
  const recordsPerPage = 3;

  useEffect(() => {
    const fetchSuspects = async () => {
      try {
        const data = await criminalService.getAll(); // fetch from backend
        setSuspects(data);

        // Count active suspects based on threat
        const activeCount = data.filter((suspect) => suspect.threat && suspect.threat.toUpperCase() !== "LOW").length;
        setActiveSuspectsCount(activeCount);

      } catch (err) {
        console.error("Error fetching suspects:", err);
      }
    };
    fetchSuspects();
  }, []);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = suspects.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(suspects.length / recordsPerPage) || 1;

  const investigationStats = [
    { title: "Assigned Cases", value: "8", icon: FileText, color: "text-primary" },
    { title: "Active Suspects", value: activeSuspectsCount.toString(), icon: Users, color: "text-blue-600" },
    { title: "Cases Closed", value: "23", icon: CheckCircle, color: "text-green-600" },
    { title: "Pending Reviews", value: "4", icon: Clock, color: "text-yellow-600" },
  ];

  const recentActivities = [
    { action: "Updated suspect profile", case: "CASE-2024-078", time: "1 hour ago", type: "update" },
    { action: "Linked evidence to case", case: "CASE-2024-079", time: "3 hours ago", type: "evidence" },
    { action: "Submitted final report", case: "CASE-2024-077", time: "1 day ago", type: "closure" },
    { action: "Cross-referenced cases", case: "Multiple", time: "2 days ago", type: "analysis" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-destructive text-destructive-foreground';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-500 text-white';
      case 'Review': return 'bg-purple-500 text-white';
      case 'Closed': return 'bg-green-500 text-white';
      case 'Wanted': return 'bg-destructive text-destructive-foreground';
      case 'Under Investigation': return 'bg-yellow-500 text-white';
      case 'Arrested': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case 'HIGH': return 'text-destructive';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-muted-foreground';
    }
  };

  const getActiveBadgeColor = (count: number) => {
    if (count === 0) return 'bg-muted text-muted-foreground';
    if (count <= 2) return 'bg-green-600 text-white';
    if (count <= 5) return 'bg-yellow-600 text-white';
    return 'bg-destructive text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/10">
      <Header />

      <main className="container mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Investigation Dashboard</h1>
            <p className="text-muted-foreground">Case management and suspect profiling</p>
          </div>
          <Badge className={`px-4 py-2 ${getActiveBadgeColor(activeSuspectsCount)}`}>
            <Search className="w-4 h-4 mr-1" />
            LEAD INVESTIGATOR
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {investigationStats.map((stat) => (
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

        {/* Assigned Cases + Investigation Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Cases */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Assigned Cases
              </CardTitle>
              <CardDescription>Your active investigation cases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {assignedCases.map((case_item) => (
                  <div key={case_item.id} className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{case_item.id}</Badge>
                        <Badge className={getPriorityColor(case_item.priority)}>{case_item.priority}</Badge>
                      </div>
                      <Badge className={getStatusColor(case_item.status)}>{case_item.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">{case_item.title}</p>
                      <p className="text-sm text-muted-foreground">{case_item.suspects} suspects involved</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Progress:</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${case_item.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{case_item.progress}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1">Update Investigation</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">View All Cases</Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Investigation Tools</CardTitle>
              <CardDescription>Advanced investigation capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-20 flex-col gap-2" 
                  onClick={() => navigate("/criminal-records")}
                >
                  <Search className="w-6 h-6" />
                  <span className="text-sm">Suspect Search</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Link className="w-6 h-6" />
                  <span className="text-sm">Cross-Link Cases</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Case Report</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/criminal-records")}
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Profile Suspect</span>
                </Button>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
                  <Gavel className="w-4 h-4 mr-2" />
                  Submit Case for Closure
                </Button>
                <Button variant="outline" className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Case Analysis Tools
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Suspect Profiles + Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Suspect Profiles */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Active Suspect Profiles
              </CardTitle>
              <CardDescription>Persons of interest in your investigations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentRecords.map((suspect) => (
                <div key={suspect.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={suspect.photo || "/images/default-criminal.jpg"} 
                        alt={suspect.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{suspect.name}</p>
                      <p className="text-sm text-muted-foreground">{suspect.crime}</p>
                      <p className={`text-sm font-medium ${getRiskColor(suspect.threat || "")}`}>
                        Threat Level: {suspect.threat}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(suspect.status || "")}>{suspect.status}</Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate("/criminal-records")}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-2">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</Button>
                <span>{currentPage} / {totalPages}</span>
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
              </div>

              <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/criminal-records")}>
                Suspect Database
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates from your cases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.case}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Criminal Details Modal */}
      <AnimatePresence>
        {selectedSuspect && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Criminal Details</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedSuspect(null)}>✕</Button>
              </div>

              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedSuspect.name}</p>
                <p><strong>Crime:</strong> {selectedSuspect.crime}</p>
                <p><strong>Threat Level:</strong> {selectedSuspect.threat}</p>
                {selectedSuspect.lastSeen && <p><strong>Last Seen:</strong> {selectedSuspect.lastSeen}</p>}
                <img
                  src={selectedSuspect.photo || "defProfile.jpg"}
                  alt={selectedSuspect.name}
                  className="w-32 h-32 object-cover rounded-full mt-2"
                />
              </div>

              <Button className="w-full" onClick={() => setSelectedSuspect(null)}>Close</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
