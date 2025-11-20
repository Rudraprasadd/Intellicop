"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { criminalService } from "@/services/criminalService";
import { CriminalModal, CriminalFormData } from "@/components/CriminalModal";

export default function CriminalRecords() {
    const criminalData = [
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
            preview: null,
            evidenceFiles: null,
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
            preview: null,
            evidenceFiles: null,
        },
        {
            id: 3,
            name: "Priya Shetty",
            age: 26,
            crime: "Cyber Crime",
            lastSeen: "Bangalore Electronic City",
            threat: "Low",
            status: "Captured",
            record: "Involved in online scam targeting senior citizens through phishing calls.",
            complainantName: "Suresh Kumar",
            complainantMobile: "9988776655",
            complainantAddress: "HSR Layout, Bangalore",
            incidentDate: "2024-03-12",
            incidentTime: "11:45",
            incidentLocation: "Online",
            incidentType: "Cyber Crime",
            incidentDescription: "Used fake bank verification calls to collect OTPs from victims.",
            accusedName: "Priya Shetty",
            victimName: "Multiple victims",
            photo: "/images/default-criminal.jpg",
            preview: null,
            evidenceFiles: null,
        },
        {
            id: 4,
            name: "Mohammed Irfan",
            age: 30,
            crime: "Fraud",
            lastSeen: "Pune City Mall",
            threat: "Medium",
            status: "Wanted",
            record: "Involved in credit card fraud rings operating across Maharashtra.",
            complainantName: "Akshay Patil",
            complainantMobile: "9090909090",
            complainantAddress: "Kothrud, Pune",
            incidentDate: "2024-02-05",
            incidentTime: "16:00",
            incidentLocation: "Pune City Mall",
            incidentType: "Fraud",
            incidentDescription: "Used cloned credit cards to purchase high-value items.",
            accusedName: "Mohammed Irfan",
            victimName: "Multiple cardholders",
            photo: "/images/default-criminal.jpg",
            preview: null,
            evidenceFiles: null,
        },
    ];

    const navigate = useNavigate();
    const [suspects, setSuspects] = useState<CriminalFormData[]>(criminalData); // Initialize with dummy data
    const [filteredSuspects, setFilteredSuspects] = useState<CriminalFormData[]>(criminalData);
    const [loading, setLoading] = useState(false); // Set to false since we have dummy data
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCriminal, setEditingCriminal] = useState<CriminalFormData | null>(null);
    const [selectedCriminal, setSelectedCriminal] = useState<CriminalFormData | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;

    // Use dummy data instead of API call
    useEffect(() => {
        setSuspects(criminalData);
        setFilteredSuspects(criminalData);
        setLoading(false);
    }, []);

    // Filter suspects
    useEffect(() => {
        if (!searchQuery) {
            setFilteredSuspects(suspects);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredSuspects(
                suspects.filter(
                    (s) =>
                        s.name.toLowerCase().includes(query) ||
                        s.crime.toLowerCase().includes(query)
                )
            );
        }
        setCurrentPage(1);
    }, [searchQuery, suspects]);

    // Handle alert close
    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => setAlertMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    // Handle Add/Edit Criminal using the modal component
    const handleAddOrEditCriminal = async (criminalData: CriminalFormData) => {
        setIsSubmitting(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (editingCriminal && editingCriminal.id) {
                // Update existing criminal
                setSuspects(prev => 
                    prev.map(c => c.id === editingCriminal.id ? { ...criminalData, id: editingCriminal.id } : c)
                );
                setAlertMessage('Case updated successfully!');
            } else {
                // Add new criminal
                const newId = Math.max(...suspects.map(s => s.id || 0)) + 1;
                const newCriminal = { ...criminalData, id: newId };
                setSuspects(prev => [...prev, newCriminal]);
                setAlertMessage('Case added successfully!');
            }
            
            setShowAddModal(false);
            setEditingCriminal(null);
        } catch (error) {
            console.error('Error saving criminal:', error);
            setAlertMessage('Failed to save case. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this criminal?")) return;
        try {
            setSuspects(prev => prev.filter((c) => c.id !== id));
            setAlertMessage("Criminal deleted successfully!");
            if (selectedCriminal?.id === id) {
                setSelectedCriminal(null);
            }
        } catch (err) {
            console.error("Error deleting criminal:", err);
            setAlertMessage("Error deleting criminal");
        }
    };

    const handleEdit = (criminal: CriminalFormData) => {
        setEditingCriminal(criminal);
        setShowAddModal(true);
    };

    const handleDetailChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setSelectedCriminal((prev) =>
            prev
                ? {
                    ...prev,
                    [name]: name === "age" ? (value === "" ? "" : Number(value)) : value,
                }
                : null
        );
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>, isEditing = false) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (isEditing && selectedCriminal) {
                    setSelectedCriminal({
                        ...selectedCriminal,
                        photo: file,
                        preview: reader.result as string,
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReportUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('Report file selected:', file);
        }
    };

    const handleUpdateCriminal = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedCriminal) return;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuspects(prev =>
                prev.map((c) => (c.id === selectedCriminal.id ? selectedCriminal : c))
            );
            setSelectedCriminal(null);
            setAlertMessage("Criminal updated successfully!");
        } catch (err) {
            setAlertMessage("Error updating criminal");
        }
    };

    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    const currentRecords = filteredSuspects.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredSuspects.length / recordsPerPage) || 1;

    if (loading)
        return <p className="text-center mt-10">Loading Case Records...</p>;

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
                        Case Records
                    </h1>
                    <Button onClick={() => setShowAddModal(true)}>
                        Add Case Record
                    </Button>
                </div>

                <div className="mb-4">
                    <Input
                        placeholder="Search by name or crime..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentRecords.map((suspect) => (
                        <Card
                            key={suspect.id}
                            className="relative flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                            onClick={() => setSelectedCriminal(suspect)}
                        >
                            <div className="flex-1 space-y-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {suspect.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {suspect.crime}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1 text-xs">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                        Age: {suspect.age || "-"}
                                    </span>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                        Threat: {suspect.threat}
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                        Status: {suspect.status}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(suspect);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(suspect.id!);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                            <div className="relative w-20 h-20 ml-4 flex-shrink-0">
                                <img
                                    src={
                                        suspect.preview ||
                                        (typeof suspect.photo === "string" ? suspect.photo : "/images/default-criminal.jpg")
                                    }
                                    alt={suspect.name}
                                    className="object-cover w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                />
                            </div>
                        </Card>
                    ))}
                </div>

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

                {/* Criminal Modal Component */}
                <CriminalModal
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    editingCriminal={editingCriminal}
                    setEditingCriminal={setEditingCriminal}
                    onSubmit={handleAddOrEditCriminal}
                    isSubmitting={isSubmitting}
                />

                {/* Selected Criminal Details Modal */}
                <AnimatePresence>
                    {selectedCriminal && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                            >
                                <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 pb-3 z-10">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Case Details
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedCriminal(null)}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <form className="space-y-4" onSubmit={handleUpdateCriminal}>
                                    {/* Criminal Basic Information Section */}
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            Criminal Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    Name <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    name="name"
                                                    placeholder="Enter criminal name"
                                                    value={selectedCriminal.name}
                                                    onChange={handleDetailChange}
                                                    required
                                                    className="dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    Age
                                                </label>
                                                <Input
                                                    type="number"
                                                    name="age"
                                                    placeholder="Enter age"
                                                    value={selectedCriminal.age}
                                                    onChange={handleDetailChange}
                                                    className="dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    Crime <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    name="crime"
                                                    placeholder="Enter crime committed"
                                                    value={selectedCriminal.crime}
                                                    onChange={handleDetailChange}
                                                    required
                                                    className="dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    Last Seen Location
                                                </label>
                                                <Input
                                                    name="lastSeen"
                                                    placeholder="Enter last known location"
                                                    value={selectedCriminal.lastSeen}
                                                    onChange={handleDetailChange}
                                                    className="dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    Threat Level
                                                </label>
                                                <Select
                                                    onValueChange={(val) =>
                                                        setSelectedCriminal({
                                                            ...selectedCriminal,
                                                            threat: val,
                                                        })
                                                    }
                                                    value={selectedCriminal.threat}
                                                >
                                                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                                                        <SelectValue placeholder="Select threat level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Low">Low</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="High">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    Status
                                                </label>
                                                <Select
                                                    onValueChange={(val) =>
                                                        setSelectedCriminal({
                                                            ...selectedCriminal,
                                                            status: val,
                                                        })
                                                    }
                                                    value={selectedCriminal.status}
                                                >
                                                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                        <SelectItem value="In-Progress">In-Progress</SelectItem>
                                                        <SelectItem value="Closed">Closed</SelectItem>
                                                        <SelectItem value="Wanted">Wanted</SelectItem>
                                                        <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                                                        <SelectItem value="Captured">Captured</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    Criminal Record Summary
                                                </label>
                                                <Textarea
                                                    name="record"
                                                    placeholder="Enter criminal record details"
                                                    value={selectedCriminal.record}
                                                    onChange={handleDetailChange}
                                                    className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rest of the form sections remain the same */}
                                    {/* ... */}
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

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