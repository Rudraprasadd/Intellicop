import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Camera, MapPin, FileText, Upload, Eye, Clock, Target, Compass } from "lucide-react";

export default function FieldDashboard() {
  const activeInvestigations = [
    { id: "INV-2024-045", case: "Bank Robbery", location: "Downtown Branch", evidence: 8, priority: "HIGH" },
    { id: "INV-2024-046", case: "Drug Trafficking", location: "Warehouse District", evidence: 15, priority: "HIGH" },
    { id: "INV-2024-047", case: "Vehicle Theft", location: "Mall Parking", evidence: 4, priority: "MEDIUM" },
  ];

  const recentEvidence = [
    { type: "Photo", description: "Crime scene exterior", case: "INV-2024-045", time: "2 hours ago", status: "Uploaded" },
    { type: "Video", description: "CCTV footage analysis", case: "INV-2024-046", time: "4 hours ago", status: "Processing" },
    { type: "Document", description: "Witness statement", case: "INV-2024-047", time: "6 hours ago", status: "Verified" },
  ];

  const fieldStats = [
    { title: "Active Cases", value: "6", icon: Target, color: "text-primary" },
    { title: "Evidence Collected", value: "23", icon: Camera, color: "text-blue-600" },
    { title: "Locations Mapped", value: "12", icon: MapPin, color: "text-green-600" },
    { title: "Field Hours", value: "7.2h", icon: Clock, color: "text-purple-600" },
  ];

  const surveilanceLocations = [
    { name: "Main Street Junction", status: "Active", priority: "HIGH", time: "Ongoing" },
    { name: "Industrial Park Gate", status: "Scheduled", priority: "MEDIUM", time: "14:00" },
    { name: "Harbor District", status: "Completed", priority: "LOW", time: "Yesterday" },
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
      case 'Active': return 'bg-green-500 text-white';
      case 'Scheduled': return 'bg-blue-500 text-white';
      case 'Completed': return 'bg-gray-500 text-white';
      case 'Uploaded': return 'bg-green-500 text-white';
      case 'Processing': return 'bg-yellow-500 text-white';
      case 'Verified': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <Header />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Field Officer Dashboard</h1>
            <p className="text-muted-foreground">Ground investigations and evidence collection</p>
          </div>
          <Badge className="bg-accent text-accent-foreground px-4 py-2">
            <Compass className="w-4 h-4 mr-1" />
            FIELD ACTIVE
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fieldStats.map((stat) => (
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
          {/* Active Investigations */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Active Investigations
              </CardTitle>
              <CardDescription>Ongoing cases requiring field work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {activeInvestigations.map((investigation) => (
                  <div key={investigation.id} className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{investigation.id}</Badge>
                        <Badge className={getPriorityColor(investigation.priority)}>{investigation.priority}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{investigation.evidence} evidence items</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{investigation.case}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {investigation.location}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1">View Case</Button>
                      <Button size="sm" variant="outline">Add Evidence</Button>
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
              <CardTitle>Field Operations</CardTitle>
              <CardDescription>Evidence collection and reporting tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-20 flex-col gap-2">
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">Take Evidence Photo</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Upload Evidence</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <MapPin className="w-6 h-6" />
                  <span className="text-sm">Mark Location</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Field Report</span>
                </Button>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
                  <Eye className="w-4 h-4 mr-2" />
                  Start Surveillance
                </Button>
                <Button variant="outline" className="w-full">
                  <Compass className="w-4 h-4 mr-2" />
                  Navigation Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Evidence */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Recent Evidence
              </CardTitle>
              <CardDescription>Recently collected and processed evidence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvidence.map((evidence, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {evidence.type === 'Photo' && <Camera className="w-5 h-5 text-primary" />}
                        {evidence.type === 'Video' && <Eye className="w-5 h-5 text-primary" />}
                        {evidence.type === 'Document' && <FileText className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium">{evidence.description}</p>
                        <p className="text-sm text-muted-foreground">{evidence.case}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(evidence.status)}>{evidence.status}</Badge>
                      <span className="text-sm text-muted-foreground">{evidence.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Evidence Archive
              </Button>
            </CardContent>
          </Card>

          {/* Surveillance Schedule */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Surveillance Schedule
              </CardTitle>
              <CardDescription>Planned and ongoing surveillance operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {surveilanceLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">Priority: {location.priority}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(location.status)}>{location.status}</Badge>
                      <span className="text-sm text-muted-foreground">{location.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}