"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { userService } from "@/services/userService";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  UserCog,
  ArrowLeft,
  RefreshCw,
  Search,
  Edit,
  Trash,
  Check,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ManageRole() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleCounts, setRoleCounts] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const roleOptions = ["ADMIN", "PATROL", "DESK", "FIELD", "INVESTIGATING"];

  // Fetch users and role counts
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usersData = await userService.getUsers();
      setUsers(usersData);
      const counts = await userService.getUserCounts();
      setRoleCounts(counts.roleWiseCount || {});
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role
  const handleSave = async (id) => {
    try {
      await userService.updateUserRole(id, editedRole);
      setUsers(users.map(u => (u.id === id ? { ...u, role: editedRole } : u)));
      setEditingId(null);
      const counts = await userService.getUserCounts();
      setRoleCounts(counts.roleWiseCount || {});

      toast({
        title: "Role Updated",
        description: `User's role changed to ${formatRole(editedRole)}.`,
      });
    } catch (err) {
      setError(err.message || "Failed to update role");
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      setDeleteConfirmId(null);
      const counts = await userService.getUserCounts();
      setRoleCounts(counts.roleWiseCount || {});

      toast({
        title: "User Deleted",
        description: "User record has been successfully removed.",
      });
    } catch (err) {
      setError(err.message || "Failed to delete user");
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const formatRole = (role) => role?.charAt(0) + role?.slice(1).toLowerCase();

  // Filtered users for search
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />

      <main className="container mx-auto p-6 space-y-6">
        {/* Back + Refresh */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/dashboard", { replace: true })}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
          <Button variant="ghost" onClick={fetchUsers}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <UserCog className="w-6 h-6 text-primary" />
            Manage User Roles
          </h1>
          <p className="text-muted-foreground">
            Modify, search, and manage officer access levels.
          </p>
        </div>

        {/* Role Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(roleCounts).map(([role, count]) => (
            <Card key={role} className="shadow-sm">
              <CardContent className="p-4 text-center space-y-1">
                <p className="text-2xl font-bold text-primary">{count}</p>
                <p className="text-sm text-muted-foreground">{formatRole(role)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search + User Table */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" /> User List
              </CardTitle>
              <CardDescription>All registered users and their assigned roles</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading users...</p>
              </div>
            ) : currentUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found for “{searchTerm}”
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {currentUsers.map((user, i) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-muted/50"
                        >
                          <TableCell>{(currentPage - 1) * usersPerPage + i + 1}</TableCell>
                          <TableCell className="flex items-center gap-3">
                            <img
                              src={user.photoUrl || "/defProfile.jpg"}
                              alt={user.username}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => (e.target.src = "/defProfile.jpg")}
                            />
                            <div>
                              <p className="font-medium">{user.username}</p>
                              <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {editingId === user.id ? (
                              <select
                                value={editedRole}
                                onChange={(e) => setEditedRole(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                              >
                                {roleOptions.map((role) => (
                                  <option key={role} value={role}>{formatRole(role)}</option>
                                ))}
                              </select>
                            ) : (
                              <Badge variant="outline">{formatRole(user.role)}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="space-x-2">
                            {editingId === user.id ? (
                              <>
                                <Button size="icon" variant="ghost" className="text-green-600 hover:text-green-700" onClick={() => handleSave(user.id)}>
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => setEditingId(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="icon" variant="ghost" onClick={() => { setEditingId(user.id); setEditedRole(user.role); }}>
                                  <Edit className="w-4 h-4 text-blue-600" />
                                </Button>
                                {deleteConfirmId === user.id ? (
                                  <>
                                    <Button size="icon" variant="ghost" className="text-green-600" onClick={() => handleDelete(user.id)}>
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-gray-500" onClick={() => setDeleteConfirmId(null)}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button size="icon" variant="ghost" className="text-red-600" onClick={() => setDeleteConfirmId(user.id)}>
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={goToPreviousPage}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant={currentPage === idx + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={goToNextPage}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
