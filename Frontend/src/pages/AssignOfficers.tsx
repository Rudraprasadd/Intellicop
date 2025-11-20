"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { userService } from "@/services/userService";
import { criminalService } from "@/services/criminalService"; // Import criminal service

interface Officer {
  id: number;
  username: string;
  password: string;
  photo_url: string;
  role: string;
}

interface CriminalCase {
  id: number;
  name: string;
  age: number;
  crime: string;
  lastSeen: string;
  threat: string;
  status: string;
  record: string;
  complainantName: string;
  complainantMobile: string;
  complainantAddress: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentType: string;
  incidentDescription: string;
  accusedName: string;
  victimName: string;
  photo: string;
  assignedOfficer: Officer | null;
}

export default function AssignOfficers() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CriminalCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<CriminalCase[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [filteredOfficers, setFilteredOfficers] = useState<Officer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [officerSearchQuery, setOfficerSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CriminalCase | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [officerLoading, setOfficerLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  // Fetch officers from API
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setOfficerLoading(true);
        console.log("Fetching officers from API...");
        
        const users = await userService.getUsers();
        console.log("API Response:", users);
        
        // Transform the API response to match our Officer interface
        const officersData: Officer[] = users.map((user: any) => ({
          id: user.id,
          username: user.username,
          password: user.password,
          photo_url: user.photo_url || "/images/default-officer.jpg",
          role: user.role || "officer"
        }));
        
        setOfficers(officersData);
        setFilteredOfficers(officersData);
        console.log("Officers loaded:", officersData);
      } catch (error) {
        console.error("Error fetching officers:", error);
        setAlertMessage("Failed to load officers. Using demo data.");
        
        // Fallback to demo data if API fails
        const demoOfficers: Officer[] = [
          {
            id: 1,
            username: "john_doe",
            password: "$2a$10$shQpEPNB1Ugu",
            photo_url: "/images/officer1.jpg",
            role: "investigator"
          },
          {
            id: 2,
            username: "jane_smith",
            password: "$2a$10$shQpEPNB1Ugu",
            photo_url: "/images/officer2.jpg",
            role: "detective"
          },
          {
            id: 3,
            username: "mike_wilson",
            password: "$2a$10$shQpEPNB1Ugu",
            photo_url: "/images/officer3.jpg",
            role: "inspector"
          }
        ];
        setOfficers(demoOfficers);
        setFilteredOfficers(demoOfficers);
      } finally {
        setOfficerLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  // Fetch criminal cases from API using criminalService
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        console.log("Fetching criminal cases from API...");
        
        // Use criminalService to get all criminals
        const criminalsData = await criminalService.getAll();
        console.log("Criminal API Response:", criminalsData);
        
        // Transform the API response to match our CriminalCase interface
        const casesData: CriminalCase[] = criminalsData.map((criminal: any) => ({
          id: criminal.id,
          name: criminal.name || "Unknown",
          age: criminal.age || 0,
          crime: criminal.crime || "Unknown Crime",
          lastSeen: criminal.lastSeen || "Unknown Location",
          threat: criminal.threat || "Medium",
          status: criminal.status || "Pending",
          record: criminal.record || "No record available",
          complainantName: criminal.complainantName || "Unknown",
          complainantMobile: criminal.complainantMobile || "N/A",
          complainantAddress: criminal.complainantAddress || "Unknown",
          incidentDate: criminal.incidentDate || new Date().toISOString().split('T')[0],
          incidentTime: criminal.incidentTime || "00:00",
          incidentLocation: criminal.incidentLocation || "Unknown",
          incidentType: criminal.incidentType || "Other",
          incidentDescription: criminal.incidentDescription || "No description available",
          accusedName: criminal.accusedName || criminal.name || "Unknown",
          victimName: criminal.victimName || "Unknown",
          photo: criminal.photo || "/images/default-criminal.jpg",
          assignedOfficer: null, // You might need to get this from your backend
        }));
        
        setCases(casesData);
        setFilteredCases(casesData);
        console.log("Criminal cases loaded:", casesData);
        
      } catch (error) {
        console.error("Error fetching criminal cases:", error);
        setAlertMessage("Failed to load criminal cases. Using demo data.");
        
        // Fallback to demo data if API fails
        const demoCases: CriminalCase[] = [
          {
            id: 1,
            name: "Rohan Verma",
            age: 28,
            crime: "Theft",
            lastSeen: "Mumbai Railway Station",
            threat: "Medium",
            status: "Wanted",
            record: "Involved in multiple theft cases in local trains and crowded markets.",
            complainantName: "Amit Sharma",
            complainantMobile: "9876543210",
            complainantAddress: "Sector 12, Navi Mumbai",
            incidentDate: "2024-02-10",
            incidentTime: "14:30",
            incidentLocation: "CST Station, Mumbai",
            incidentType: "Theft",
            incidentDescription: "Suspect stole a backpack containing valuable electronics.",
            accusedName: "Unknown",
            victimName: "Amit Sharma",
            photo: "/images/default-criminal.jpg",
            assignedOfficer: null,
          },
          {
            id: 2,
            name: "Sanjay Naik",
            age: 34,
            crime: "Assault",
            lastSeen: "Hyderabad Banjara Hills",
            threat: "High",
            status: "Under Investigation",
            record: "Accused of involvement in a violent altercation outside a nightclub.",
            complainantName: "Rahul Singh",
            complainantMobile: "9123456780",
            complainantAddress: "Banjara Hills, Hyderabad",
            incidentDate: "2024-01-25",
            incidentTime: "23:15",
            incidentLocation: "Night Owl Club, Hyderabad",
            incidentType: "Assault",
            incidentDescription: "Victim was physically attacked leading to minor injuries.",
            accusedName: "Sanjay Naik",
            victimName: "Rahul Singh",
            photo: "/images/default-criminal.jpg",
            assignedOfficer: null,
          }
        ];
        setCases(demoCases);
        setFilteredCases(demoCases);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Filter cases based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCases(cases);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCases(
        cases.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.crime.toLowerCase().includes(query)
        )
      );
    }
    setCurrentPage(1);
  }, [searchQuery, cases]);

  // Filter officers based on search and role
  useEffect(() => {
    let filtered = officers;
    
    if (officerSearchQuery) {
      const query = officerSearchQuery.toLowerCase();
      filtered = filtered.filter(officer => 
        officer.username.toLowerCase().includes(query)
      );
    }
    
    if (selectedRole !== "all") {
      filtered = filtered.filter(officer => 
        officer.role === selectedRole
      );
    }
    
    setFilteredOfficers(filtered);
  }, [officerSearchQuery, selectedRole, officers]);

  // Handle alert close
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleAssignOfficer = (criminalCase: CriminalCase) => {
    setSelectedCase(criminalCase);
    setSelectedOfficer(criminalCase.assignedOfficer);
    setShowAssignModal(true);
  };

  const handleOfficerSelect = (officer: Officer) => {
    setSelectedOfficer(officer);
  };

  const confirmAssignment = async () => {
    if (!selectedCase || !selectedOfficer) return;

    try {
      // Update the case with the assigned officer in local state
      setCases(prev => 
        prev.map(c => 
          c.id === selectedCase.id 
            ? { ...c, assignedOfficer: selectedOfficer } 
            : c
        )
      );

      setAlertMessage(`Officer ${selectedOfficer.username} assigned to case ${selectedCase.name}`);
      
      // TODO: Make API call to save assignment to backend
      // You might need to extend your criminalService with an assignOfficer method
      // Example: await criminalService.assignOfficer(selectedCase.id, selectedOfficer.id);
      
    } catch (error) {
      console.error("Error assigning officer:", error);
      setAlertMessage("Failed to assign officer. Please try again.");
    } finally {
      setShowAssignModal(false);
      setSelectedCase(null);
      setSelectedOfficer(null);
    }
  };

  const removeAssignment = async (caseId: number) => {
    try {
      setCases(prev =>
        prev.map(c =>
          c.id === caseId
            ? { ...c, assignedOfficer: null }
            : c
        )
      );
      
      // TODO: Make API call to remove assignment from backend
      // Example: await criminalService.removeOfficerAssignment(caseId);
      
      setAlertMessage("Officer assignment removed");
    } catch (error) {
      console.error("Error removing assignment:", error);
      setAlertMessage("Failed to remove assignment.");
    }
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredCases.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCases.length / recordsPerPage) || 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <main className="container mx-auto p-6">
          <div className="flex items-center justify-center mt-10">
            <div className="text-center">
              <p className="text-lg">Loading criminal cases...</p>
              <p className="text-sm text-muted-foreground mt-2">Fetching data from server</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            Assign Officers to Cases
          </h1>
          <div className="text-sm text-muted-foreground">
            {cases.length} cases • {officers.length} officers available
          </div>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search cases by name or crime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {cases.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground">No criminal cases found</p>
            <p className="text-sm text-muted-foreground mt-2">
              {loading ? "Loading..." : "There are no cases available to assign officers."}
            </p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentRecords.map((criminalCase) => (
                <Card
                  key={criminalCase.id}
                  className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {criminalCase.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {criminalCase.crime}
                        </p>
                      </div>
                      <div className="relative w-16 h-16 ml-2 flex-shrink-0">
                        <img
                          src={criminalCase.photo}
                          alt={criminalCase.name}
                          className="object-cover w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).src = "/images/default-criminal.jpg";
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Age: {criminalCase.age || "-"}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        Threat: {criminalCase.threat}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Status: {criminalCase.status}
                      </span>
                    </div>

                    {/* Assigned Officer Info */}
                    {criminalCase.assignedOfficer ? (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-2">
                          Assigned Officer
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center overflow-hidden">
                            {criminalCase.assignedOfficer.photo_url ? (
                              <img 
                                src={criminalCase.assignedOfficer.photo_url} 
                                alt={criminalCase.assignedOfficer.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/images/default-officer.jpg";
                                }}
                              />
                            ) : (
                              <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                              {criminalCase.assignedOfficer.username}
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300 capitalize">
                              {criminalCase.assignedOfficer.role}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeAssignment(criminalCase.id)}
                        >
                          Remove Assignment
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                          No Officer Assigned
                        </p>
                        <Button
                          onClick={() => handleAssignOfficer(criminalCase)}
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          Assign Officer
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {filteredCases.length > recordsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </Button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Rest of the component remains the same */}
        {/* Assign Officer Modal */}
        <AnimatePresence>
          {showAssignModal && selectedCase && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Assign Officer to Case
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedCase.name} - {selectedCase.crime}
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Search and Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Search Officers
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search by username..."
                          value={officerSearchQuery}
                          onChange={(e) => setOfficerSearchQuery(e.target.value)}
                          className="pl-10 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Filter by Role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="all">All Roles</option>
                        <option value="investigator">Investigator</option>
                        <option value="detective">Detective</option>
                        <option value="inspector">Inspector</option>
                        <option value="officer">Officer</option>
                      </select>
                    </div>
                  </div>

                  {/* Loading State for Officers */}
                  {officerLoading ? (
                    <div className="text-center py-8">
                      <p>Loading officers...</p>
                    </div>
                  ) : (
                    <>
                      {/* Currently Selected Officer */}
                      {selectedOfficer && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                            Selected Officer
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center overflow-hidden">
                              {selectedOfficer.photo_url ? (
                                <img 
                                  src={selectedOfficer.photo_url} 
                                  alt={selectedOfficer.username}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/images/default-officer.jpg";
                                  }}
                                />
                              ) : (
                                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-blue-900 dark:text-blue-100">
                                {selectedOfficer.username}
                              </p>
                              <p className="text-sm text-blue-700 dark:text-blue-300 capitalize">
                                {selectedOfficer.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Officers Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                        {filteredOfficers.map((officer) => (
                          <Card
                            key={officer.id}
                            className={`p-4 cursor-pointer transition-all duration-200 ${
                              selectedOfficer?.id === officer.id
                                ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => handleOfficerSelect(officer)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {officer.photo_url ? (
                                  <img 
                                    src={officer.photo_url} 
                                    alt={officer.username}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "/images/default-officer.jpg";
                                    }}
                                  />
                                ) : (
                                  <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                  {officer.username}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                  {officer.role}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {filteredOfficers.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No officers found matching your criteria</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedCase(null);
                      setSelectedOfficer(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmAssignment}
                    disabled={!selectedOfficer || officerLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Assign Officer
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alert Message */}
        {alertMessage && (
          <motion.div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {alertMessage}
          </motion.div>
        )}
      </main>
    </div>
  );
}