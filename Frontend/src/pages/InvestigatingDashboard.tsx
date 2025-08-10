import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Search, FileText, Users, Target, CheckCircle, Clock, Gavel, Link } from "lucide-react";

export default function InvestigatingDashboard() {
  const assignedCases = [
    { id: "CASE-2024-078", title: "Armed Robbery Investigation", suspects: 3, status: "Active", priority: "HIGH", progress: 75 },
    { id: "CASE-2024-079", title: "Financial Fraud Analysis", suspects: 2, status: "Active", priority: "MEDIUM", progress: 45 },
    { id: "CASE-2024-080", title: "Drug Distribution Ring", suspects: 8, status: "Review", priority: "HIGH", progress: 90 },
  ];

  const suspectProfiles = [
    { id: "SP-001", name: "Marcus Johnson", cases: 3, status: "Wanted", risk: "HIGH" },
    { id: "SP-002", name: "Lisa Cooper", cases: 2, status: "Under Investigation", risk: "MEDIUM" },
    { id: "SP-003", name: "David Rodriguez", cases: 1, status: "Arrested", risk: "LOW" },
  ];

  const investigationStats = [
    { title: "Assigned Cases", value: "8", icon: FileText, color: "text-primary" },
    { title: "Active Suspects", value: "15", icon: Users, color: "text-blue-600" },
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
    switch (risk) {
      case 'HIGH': return 'text-destructive';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-muted-foreground';
    }
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
          <Badge className="bg-primary/80 text-primary-foreground px-4 py-2">
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
              <Button variant="outline" className="w-full">
                View All Cases
              </Button>
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
                <Button className="h-20 flex-col gap-2">
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
                <Button variant="outline" className="h-20 flex-col gap-2">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Suspect Profiles */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Active Suspect Profiles
              </CardTitle>
              <CardDescription>Persons of interest in your investigations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suspectProfiles.map((suspect) => (
                  <div key={suspect.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{suspect.name}</p>
                        <p className="text-sm text-muted-foreground">{suspect.cases} related cases</p>
                        <p className={`text-sm font-medium ${getRiskColor(suspect.risk)}`}>
                          Risk Level: {suspect.risk}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(suspect.status)}>{suspect.status}</Badge>
                      <Button size="sm" variant="outline">View Profile</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Suspect Database
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Investigation Activities
              </CardTitle>
              <CardDescription>Your recent case work and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'update' ? 'bg-blue-500' :
                      activity.type === 'evidence' ? 'bg-green-500' :
                      activity.type === 'closure' ? 'bg-purple-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.case}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Activity History
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}