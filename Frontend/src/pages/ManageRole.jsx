// src/pages/ManageRole.jsx (updated)

"use client"

import { useState, useEffect } from "react"
import { FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaSearch, FaEdit, FaTrash, FaArrowLeft, FaPlus, FaSync } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/layout/Header"
import { useNavigate } from "react-router-dom"
import { userService } from "@/services/userService"

const ManageRole = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const [editedRole, setEditedRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [roleCounts, setRoleCounts] = useState({})

  const usersPerPage = 10
  const roleOptions = ["ADMIN", "PATROL", "DESK", "FIELD", "INVESTIGATING"]

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch all users from backend
      const usersData = await userService.getUsers()
      setUsers(usersData)
      
      // Also fetch role counts for statistics
      const counts = await userService.getUserCounts()
      setRoleCounts(counts.roleWiseCount || {})
    } catch (err) {
      console.error("Failed to fetch users:", err)
      setError(err.message || "Failed to load users. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch;
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

  const handleSave = async (id) => {
    try {
      // Update user role in backend
      await userService.updateUserRole(id, editedRole)
      
      // Update local state
      setUsers(users.map((user) => 
        user.id === id ? { ...user, role: editedRole } : user
      ))
      
      setEditingId(null)
      setEditedRole("")
      
      // Show success message
      setError(null)
      
      // Refresh role counts
      const counts = await userService.getUserCounts()
      setRoleCounts(counts.roleWiseCount || {})
    } catch (err) {
      console.error("Failed to update user role:", err)
      setError(err.message || "Failed to update user role. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id)
      setUsers(users.filter(user => user.id !== id))
      setDeleteConfirmId(null)
      
      // Show success message
      setError(null)
      
      // Refresh role counts
      const counts = await userService.getUserCounts()
      setRoleCounts(counts.roleWiseCount || {})
    } catch (err) {
      console.error("Failed to delete user:", err)
      setError(err.message || "Failed to delete user. Please try again.")
    }
  }

  const confirmDelete = (id) => {
    setDeleteConfirmId(id)
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  // Format role for display (convert uppercase to title case)
  const formatRole = (role) => {
    if (!role) return "";
    // Handle all caps roles like "ADMIN", "PATROL", etc.
    if (role === role.toUpperCase()) {
      return role.charAt(0) + role.slice(1).toLowerCase();
    }
    // Handle already formatted roles
    return role;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back to Dashboard Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/dashboard", { replace: true })}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          >
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-800">
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}

        {/* Role Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {Object.entries(roleCounts).map(([role, count]) => (
            <div key={role} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{count}</div>
              <div className="text-sm text-gray-600">{formatRole(role)}</div>
            </div>
          ))}
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchUsers}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Refresh users"
                >
                  <FaSync className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 uppercase tracking-wider">#</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 uppercase tracking-wider">User</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 uppercase tracking-wider">Role</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 uppercase tracking-wider">Username</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
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
                            className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                          >
                            <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                              {indexOfFirstUser + index + 1}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-4">
                                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                                  <img
                                    src={user.photoUrl || "/diverse-user-avatars.png"}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                    onError={(e) => {
                                      e.target.src = "/diverse-user-avatars.png"
                                    }}
                                  />
                                </motion.div>
                                <div>
                                  <div className="font-semibold text-gray-900">{user.username}</div>
                                  <div className="text-sm text-gray-500">
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
                                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  {roleOptions.map((role) => (
                                    <option key={role} value={role}>
                                      {formatRole(role)}
                                    </option>
                                  ))}
                                </motion.select>
                              ) : (
                                <span className="text-sm text-gray-900 font-medium">{formatRole(user.role)}</span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm text-gray-700">{user.username}</span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                {editingId === user.id ? (
                                  <>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleSave(user.id)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                      title="Save changes"
                                    >
                                      <FaCheck className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={handleCancel}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Cancel editing"
                                    >
                                      <FaTimes className="w-4 h-4" />
                                    </motion.button>
                                  </>
                                ) : (
                                  <>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleEdit(user.id, user.role)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit role"
                                    >
                                      <FaEdit className="w-4 h-4" />
                                    </motion.button>
                                    {deleteConfirmId === user.id ? (
                                      <>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => handleDelete(user.id)}
                                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Confirm delete"
                                        >
                                          <FaCheck className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={cancelDelete}
                                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                          title="Cancel delete"
                                        >
                                          <FaTimes className="w-4 h-4" />
                                        </motion.button>
                                      </>
                                    ) : (
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => confirmDelete(user.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete user"
                                      >
                                        <FaTrash className="w-4 h-4" />
                                      </motion.button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-12 text-center">
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <FaSearch className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">No users found</h3>
                                <p className="text-gray-500">Try adjusting your search criteria</p>
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
                  className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 gap-4"
                >
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{indexOfFirstUser + 1}</span> to{" "}
                    <span className="font-semibold text-gray-900">{Math.min(indexOfLastUser, filteredUsers.length)}</span>{" "}
                    of <span className="font-semibold text-gray-900">{filteredUsers.length}</span> results
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed text-gray-400"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
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
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100 border border-gray-300"
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
                          ? "opacity-50 cursor-not-allowed text-gray-400"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      <span>Next</span>
                      <FaChevronRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ManageRole