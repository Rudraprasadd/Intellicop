"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { MapPin, AlertTriangle, Camera, Search, Radio, Clock, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PatrolDashboard() {
  const navigate = useNavigate();

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patrol Dashboard</h1>
            <p className="text-muted-foreground">Field operations and incident management</p>
          </div>
          <Badge className="bg-primary text-primary-foreground px-4 py-2">
            <Radio className="w-4 h-4 mr-1" /> PATROL ACTIVE
          </Badge>
        </div>

        {/* Stats Grid */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Alerts */}
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
                  <div className="space-y-1">
                    <p className="font-medium">{alert.type}: {alert.suspect}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {alert.location}
                    </p>
                  </div>
                  <Button size="sm" className="mt-2 w-full">Respond to Alert</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">View All Alerts</Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common patrol operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-20 flex-col gap-2">
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">Report Incident</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate("/criminal-records")}
                >
                  <Search className="w-6 h-6" />
                  <span className="text-sm">Suspect Lookup</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">Upload Photo</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <MapPin className="w-6 h-6" />
                  <span className="text-sm">Log Location</span>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
                  <Radio className="w-4 h-4 mr-2" /> Request Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Incidents */}
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
      </main>
    </div>
  );
}
