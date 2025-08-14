"use client"

import { useState } from "react"
import { FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaSearch, FaEdit } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/layout/Header"

const ManageRole = () => {
  // Enhanced user data with 20 entries
  const allUsers = [
    {
      id: 1,
      name: "John Smith",
      role: "Patrol Officer",
      status: "Active",
      lastActivity: "2 hours ago",
      department: "Patrol",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Desk Officer",
      status: "Active",
      lastActivity: "30 minutes ago",
      department: "Administration",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      name: "Michael Brown",
      role: "Field Officer",
      status: "Active",
      lastActivity: "1 day ago",
      department: "Operations",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "Supervisor",
      status: "Active",
      lastActivity: "5 hours ago",
      department: "Management",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: 5,
      name: "Robert Wilson",
      role: "Patrol Officer",
      status: "Inactive",
      lastActivity: "1 week ago",
      department: "Patrol",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      id: 6,
      name: "Jennifer Martinez",
      role: "Desk Officer",
      status: "Active",
      lastActivity: "3 hours ago",
      department: "Administration",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
      id: 7,
      name: "David Anderson",
      role: "Field Officer",
      status: "Active",
      lastActivity: "Yesterday",
      department: "Operations",
      image: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      id: 8,
      name: "Lisa Taylor",
      role: "Supervisor",
      status: "Inactive",
      lastActivity: "2 weeks ago",
      department: "Management",
      image: "https://randomuser.me/api/portraits/women/8.jpg",
    },
    {
      id: 9,
      name: "James Thomas",
      role: "Patrol Officer",
      status: "Active",
      lastActivity: "4 hours ago",
      department: "Patrol",
      image: "https://randomuser.me/api/portraits/men/9.jpg",
    },
    {
      id: 10,
      name: "Jessica Garcia",
      role: "Desk Officer",
      status: "Active",
      lastActivity: "1 hour ago",
      department: "Administration",
      image: "https://randomuser.me/api/portraits/women/10.jpg",
    },
    {
      id: 11,
      name: "Daniel Rodriguez",
      role: "Field Officer",
      status: "Inactive",
      lastActivity: "3 days ago",
      department: "Operations",
      image: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      id: 12,
      name: "Amanda Lee",
      role: "Supervisor",
      status: "Active",
      lastActivity: "Just now",
      department: "Management",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: 13,
      name: "Christopher Walker",
      role: "Patrol Officer",
      status: "Active",
      lastActivity: "6 hours ago",
      department: "Patrol",
      image: "https://randomuser.me/api/portraits/men/13.jpg",
    },
    {
      id: 14,
      name: "Michelle Hall",
      role: "Desk Officer",
      status: "Inactive",
      lastActivity: "5 days ago",
      department: "Administration",
      image: "https://randomuser.me/api/portraits/women/14.jpg",
    },
    {
      id: 15,
      name: "Matthew Young",
      role: "Field Officer",
      status: "Active",
      lastActivity: "2 hours ago",
      department: "Operations",
      image: "https://randomuser.me/api/portraits/men/15.jpg",
    },
    {
      id: 16,
      name: "Nicole Allen",
      role: "Supervisor",
      status: "Active",
      lastActivity: "Yesterday",
      department: "Management",
      image: "https://randomuser.me/api/portraits/women/16.jpg",
    },
    {
      id: 17,
      name: "Andrew Hernandez",
      role: "Patrol Officer",
      status: "Inactive",
      lastActivity: "1 month ago",
      department: "Patrol",
      image: "https://randomuser.me/api/portraits/men/17.jpg",
    },
    {
      id: 18,
      name: "Stephanie King",
      role: "Desk Officer",
      status: "Active",
      lastActivity: "45 minutes ago",
      department: "Administration",
      image: "https://randomuser.me/api/portraits/women/18.jpg",
    },
    {
      id: 19,
      name: "Joshua Wright",
      role: "Field Officer",
      status: "Active",
      lastActivity: "Today",
      department: "Operations",
      image: "https://randomuser.me/api/portraits/men/19.jpg",
    },
    {
      id: 20,
      name: "Rachel Scott",
      role: "Supervisor",
      status: "Inactive",
      lastActivity: "10 days ago",
      department: "Management",
      image: "https://randomuser.me/api/portraits/women/20.jpg",
    },
  ]

  const [users, setUsers] = useState(allUsers)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const [editedRole, setEditedRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const usersPerPage = 10
  const roleOptions = ["Patrol Officer", "Desk Officer", "Field Officer", "Supervisor"]
  const statusOptions = ["All", "Active", "Inactive"]

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleEdit = (id, currentRole) => {
    setEditingId(id)
    setEditedRole(currentRole)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditedRole("")
  }

  const handleSave = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role: editedRole } : user)))
    setEditingId(null)
    setEditedRole("")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-border bg-muted/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-foreground">User Management</h2>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-muted-foreground text-sm" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "All" ? "All Status" : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-foreground">#</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-foreground">User</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-foreground">Role</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-foreground">Department</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-foreground">Last Activity</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{
                          backgroundColor: "hsl(var(--accent) / 0.05)",
                          transition: { duration: 0.2 },
                        }}
                        className="border-b border-border hover:bg-accent/5 transition-all duration-200"
                      >
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          {indexOfFirstUser + index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            <motion.div whileHover={{ scale: 1.05 }} className="relative">
                              <img
                                src={user.image || "/placeholder.svg"}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-border shadow-sm"
                                onError={(e) => {
                                  e.target.src = "/diverse-user-avatars.png"
                                }}
                              />
                              <div
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card shadow-sm ${
                                  user.status === "Active" ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                            </motion.div>
                            <div>
                              <div className="font-semibold text-foreground">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {user.id.toString().padStart(4, "0")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {editingId === user.id ? (
                            <motion.select
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                              value={editedRole}
                              onChange={(e) => setEditedRole(e.target.value)}
                              className="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </motion.select>
                          ) : (
                            <span className="text-sm text-foreground font-medium">{user.role}</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-foreground">{user.department}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-muted-foreground">{user.lastActivity}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {editingId === user.id ? (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleSave(user.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                  title="Save changes"
                                >
                                  <FaCheck className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={handleCancel}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Cancel editing"
                                >
                                  <FaTimes className="w-4 h-4" />
                                </motion.button>
                              </>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(user.id, user.role)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit role"
                              >
                                <FaEdit className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <FaSearch className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">No users found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {filteredUsers.length > usersPerPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border bg-muted/20 gap-4"
            >
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{indexOfFirstUser + 1}</span> to{" "}
                <span className="font-semibold text-foreground">{Math.min(indexOfLastUser, filteredUsers.length)}</span>{" "}
                of <span className="font-semibold text-foreground">{filteredUsers.length}</span> results
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed text-muted-foreground"
                      : "text-foreground hover:bg-accent/10 border border-border"
                  }`}
                >
                  <FaChevronLeft className="w-3 h-3" />
                  <span>Previous</span>
                </motion.button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = index + 1
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index
                    } else {
                      pageNumber = currentPage - 2 + index
                    }

                    return (
                      <motion.button
                        key={pageNumber}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => paginate(pageNumber)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === pageNumber
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground hover:bg-accent/10 border border-border"
                        }`}
                      >
                        {pageNumber}
                      </motion.button>
                    )
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed text-muted-foreground"
                      : "text-foreground hover:bg-accent/10 border border-border"
                  }`}
                >
                  <span>Next</span>
                  <FaChevronRight className="w-3 h-3" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ManageRole