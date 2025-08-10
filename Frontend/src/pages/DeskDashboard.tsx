import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { FileText, Users, UserPlus, Upload, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";

export default function DeskDashboard() {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-destructive text-destructive-foreground';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getVisitorStatusColor = (status: string) => {
    switch (status) {
      case 'Cleared': return 'bg-green-500 text-white';
      case 'In Progress': return 'bg-blue-500 text-white';
      case 'Pending': return 'bg-yellow-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
            <FileText className="w-4 h-4 mr-1" />
            DESK DUTY
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {todayStats.map((stat) => (
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
          {/* Pending Cases */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Pending Case Registration
              </CardTitle>
              <CardDescription>FIRs and complaints awaiting processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {pendingCases.map((case_item) => (
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
                      <Button size="sm" className="flex-1">Process Case</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                View All Pending Cases
              </Button>
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
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Register FIR</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <UserPlus className="w-6 h-6" />
                  <span className="text-sm">Add Criminal</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Visitor Check-in</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Upload Document</span>
                </Button>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Court Hearing
                </Button>
                <Button variant="outline" className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Assign Case to Officer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Management */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Today's Visitor Log
            </CardTitle>
            <CardDescription>Manage visitor check-ins and meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentVisitors.map((visitor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{visitor.name}</p>
                      <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getVisitorStatusColor(visitor.status)}>{visitor.status}</Badge>
                    <span className="text-sm text-muted-foreground">{visitor.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1">
                <UserPlus className="w-4 h-4 mr-1" />
                New Visitor Check-in
              </Button>
              <Button variant="outline" className="flex-1">
                View Full Visitor Log
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}