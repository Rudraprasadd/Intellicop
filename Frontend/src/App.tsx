import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PatrolDashboard from "./pages/PatrolDashboard";
import DeskDashboard from "./pages/DeskDashboard";
import FieldDashboard from "./pages/FieldDashboard";
import InvestigatingDashboard from "./pages/InvestigatingDashboard";
import NotFound from "./pages/NotFound";
import AddUserForm from "./pages/AddUser";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based Route Component (case-insensitive role check)
const RoleRoute = ({
  allowedRole,
  children,
}: {
  allowedRole: string;
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard Router - routes users to their role-specific dashboard
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role.toLowerCase()) {
    case "admin":
      return <AdminDashboard />;
    case "patrol":
      return <PatrolDashboard />;
    case "desk":
      return <DeskDashboard />;
    case "field":
      return <FieldDashboard />;
    case "investigating":
      return <InvestigatingDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="admin">
                      <AdminDashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patrol"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="patrol">
                      <PatrolDashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/desk"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="desk">
                      <DeskDashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/field"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="field">
                      <FieldDashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investigating"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="investigating">
                      <InvestigatingDashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-user"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="admin">
                      <AddUserForm />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
