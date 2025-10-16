import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Users, FileText, Activity, BarChart3, UserPlus, Shield, Database, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [databaseHealth, setDatabaseHealth] = useState<number>(0);
  const [roleCounts, setRoleCounts] = useState({
    patrolOfficers: 0,
    deskOfficers: 0,
    fieldOfficers: 0,
    investigatingOfficers: 0,
    administrators: 0,
  });
  const navigate = useNavigate();

  const fetchDatabaseHealth = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/health/database");
      setDatabaseHealth(res.data.healthPercentage);
    } catch (err) {
      console.error("❌ Error fetching database health:", err);
      setDatabaseHealth(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, healthRes] = await Promise.all([
          axios.get("http://localhost:8081/api/users/total"),
          axios.get("http://localhost:8081/api/health/database")
        ]);

        const data = usersRes.data;

        // Map backend roles to frontend state
        const counts = {
          patrolOfficers: data.roleWiseCount?.PATROL ?? 0,
          deskOfficers: data.roleWiseCount?.DESK ?? 0,
          fieldOfficers: data.roleWiseCount?.FIELD ?? 0,
          investigatingOfficers: data.roleWiseCount?.INVESTIGATING ?? 0,
          administrators: data.roleWiseCount?.ADMIN ?? 0,
        };

        setRoleCounts(counts);
        setDatabaseHealth(healthRes.data.healthPercentage);

        // Use backend total directly
        if (typeof data.totalUsers === "number") {
          setTotalUsers(data.totalUsers);
        } else {
          // Fallback: calculate total from role counts
          const calculatedTotal = Object.values(counts).reduce((sum, val) => sum + val, 0);
          setTotalUsers(calculatedTotal);
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const stats = [
    { title: "Total Users", value: totalUsers.toString(), icon: Users, color: "text-primary" },
    { title: "Active Cases", value: "89", icon: FileText, color: "text-blue-600" },
    { title: "System Alerts", value: "12", icon: AlertTriangle, color: "text-destructive" },
    { 
      title: "Database Health", 
      value: `${databaseHealth}%`, 
      icon: Database, 
      color: databaseHealth > 75 ? "text-green-600" : 
             databaseHealth > 50 ? "text-yellow-600" : 
             "text-destructive" 
    },
  ];

  const recentActivities = [
    { user: "Officer Smith", action: "Created new criminal profile", time: "2 mins ago", type: "create" },
    { user: "Detective Brown", action: "Updated case #2024-001", time: "15 mins ago", type: "update" },
    { user: "Officer Wilson", action: "Logged patrol incident", time: "1 hour ago", type: "incident" },
    { user: "System", action: "Database backup completed", time: "2 hours ago", type: "system" },
  ];

  const userRoles = [
    { role: "Patrol Officers", count: roleCounts.patrolOfficers, color: "bg-primary" },
    { role: "Desk Officers", count: roleCounts.deskOfficers, color: "bg-secondary" },
    { role: "Field Officers", count: roleCounts.fieldOfficers, color: "bg-accent" },
    { role: "Investigating Officers", count: roleCounts.investigatingOfficers, color: "bg-primary/80" },
    { role: "Administrators", count: roleCounts.administrators, color: "bg-destructive" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />

      <main className="container mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administrator Dashboard</h1>
            <p className="text-muted-foreground">System overview and management controls</p>
          </div>
          <Badge className="bg-destructive text-destructive-foreground px-4 py-2">
            <Shield className="w-4 h-4 mr-1" />
            ADMIN ACCESS
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage system users and roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {userRoles.map((role) => (
                  <div key={role.role} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${role.color}`} />
                      <span className="font-medium">{role.role}</span>
                    </div>
                    <Badge variant="outline">{role.count}</Badge>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1"
                 onClick={() =>  navigate("/add-user", { replace: true })}>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add User
                </Button>
                <Button variant="outline" className="flex-1"
                 onClick={() =>  navigate("/manage-role", { replace: true })}>
                  Manage Roles
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Activity */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent System Activity
              </CardTitle>
              <CardDescription>Monitor user actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "create"
                          ? "bg-green-500"
                          : activity.type === "update"
                          ? "bg-blue-500"
                          : activity.type === "incident"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full Activity Log
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Management Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Criminal Records</h3>
                <p className="text-sm text-muted-foreground">View and manage all criminal profiles</p>
              </div>
              <Button  className="w-full" onClick={() => navigate("/criminal-records")}>Access Records</Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">System Reports</h3>
                <p className="text-sm text-muted-foreground">Generate performance and activity reports</p>
              </div>
              <Button className="w-full" variant="outline">
                Generate Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">System Health</h3>
                <p className="text-sm text-muted-foreground">Monitor database and performance metrics</p>
              </div>
              <Button className="w-full" 
                variant="outline"
                onClick={async () => {
                  try {
                    const res = await axios.get("http://localhost:8081/api/health/database/report", {
                      responseType: "blob", // important for binary PDF
                    });

                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "database_health_report.pdf");
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  } catch (err) {
                    console.error("❌ Error downloading report:", err);
                  }
                }}>
                View Metrics
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}