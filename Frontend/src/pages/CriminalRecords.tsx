"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { criminalService } from "@/services/criminalService";

interface CriminalFormData {
    id?: number;
    name: string;
    age: number | "";
    crime: string;
    threat: string;
    lastSeen: string;
    status: string;
    record: string;
    photo: File | string | null;
    preview?: string | null;
}

export default function CriminalRecords() {
    const navigate = useNavigate();
    const [suspects, setSuspects] = useState<CriminalFormData[]>([]);
    const [filteredSuspects, setFilteredSuspects] = useState<CriminalFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCriminal, setEditingCriminal] = useState<CriminalFormData | null>(null);
    const [selectedCriminal, setSelectedCriminal] = useState<CriminalFormData | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;

    const [newCriminal, setNewCriminal] = useState<CriminalFormData>({
        name: "",
        age: "",
        crime: "",
        threat: "Low",
        lastSeen: "",
        status: "Under Investigation",
        record: "",
        photo: null,
        preview: null,
    });

    // Fetch all criminals
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await criminalService.getAll();
                setSuspects(data);
            } catch (err) {
                console.error("Error fetching criminals:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter suspects based on search
    useEffect(() => {
        if (!searchQuery) {
            setFilteredSuspects(suspects);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredSuspects(
                suspects.filter(
                    s =>
                        s.name.toLowerCase().includes(query) ||
                        s.crime.toLowerCase().includes(query)
                )
            );
        }
        setCurrentPage(1); // Reset to first page on search
    }, [searchQuery, suspects]);

    // Alert auto-dismiss
    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => setAlertMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    // Handle form changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewCriminal(prev => ({
            ...prev,
            [name]: name === "age" ? (value === "" ? "" : Number(value)) : value
        }));
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>, isEditing = false) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (isEditing && selectedCriminal) {
                    setSelectedCriminal({ ...selectedCriminal, photo: file, preview: reader.result as string });
                } else if (isEditing && editingCriminal) {
                    setNewCriminal({ ...newCriminal, photo: file, preview: reader.result as string });
                } else {
                    setNewCriminal({ ...newCriminal, photo: file, preview: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Add or Edit criminal
    const handleAddOrEditCriminal = async (e: FormEvent) => {
        e.preventDefault();
        if (!newCriminal.name || !newCriminal.crime) return alert("Name and Crime are required!");

        const formData = new FormData();
        formData.append(
            "criminal",
            new Blob([JSON.stringify({
                name: newCriminal.name,
                age: newCriminal.age,
                crime: newCriminal.crime,
                threat: newCriminal.threat,
                lastSeen: newCriminal.lastSeen,
                status: newCriminal.status,
                record: newCriminal.record,
            })], { type: "application/json" })
        );
        if (newCriminal.photo instanceof File) formData.append("photoFile", newCriminal.photo);

        try {
            const response = await fetch(editingCriminal
                ? `http://localhost:8081/api/criminals/${editingCriminal.id}`
                : "http://localhost:8081/api/criminals", {
                method: editingCriminal ? "PUT" : "POST",
                body: formData,
            });

            if (!response.ok) throw new Error(await response.text() || "Failed to add/edit criminal");

            const savedCriminal = await response.json();
            if (editingCriminal) {
                setSuspects(prev => prev.map(c => c.id === savedCriminal.id ? savedCriminal : c));
            } else {
                setSuspects(prev => [...prev, savedCriminal]);
            }

            setShowAddModal(false);
            setEditingCriminal(null);
            setNewCriminal({
                name: "",
                age: "",
                crime: "",
                threat: "Low",
                lastSeen: "",
                status: "Under Investigation",
                record: "",
                photo: null,
                preview: null,
            });
        } catch (err) {
            console.error("Error adding/editing criminal:", err);
            alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    // Delete criminal
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this criminal?")) return;
        try {
            const response = await fetch(`http://localhost:8081/api/criminals/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete criminal");
            setSuspects(prev => prev.filter(c => c.id !== id));
            setAlertMessage("Criminal deleted successfully!");
            setCurrentPage(prev => Math.min(prev, Math.ceil((filteredSuspects.length - 1) / recordsPerPage) || 1));
        } catch (err) {
            console.error("Error deleting criminal:", err);
            setAlertMessage("Error deleting criminal: " + (err instanceof Error ? err.message : "Unknown"));
        }
    };

    const handleEdit = (criminal: CriminalFormData) => {
        setEditingCriminal(criminal);
        setNewCriminal({
            ...criminal,
            age: criminal.age || "",
            photo: null,
            preview: typeof criminal.photo === "string" ? criminal.photo : criminal.preview || null,
        });
        setShowAddModal(true);
    };

    // Detail modal update
    const handleDetailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelectedCriminal(prev => prev ? { ...prev, [name]: name === "age" ? (value === "" ? "" : Number(value)) : value } : null);
    };

    const handleUpdateCriminal = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedCriminal) return;

        const formData = new FormData();
        formData.append(
            "criminal",
            new Blob([JSON.stringify({
                name: selectedCriminal.name,
                age: selectedCriminal.age,
                crime: selectedCriminal.crime,
                threat: selectedCriminal.threat,
                lastSeen: selectedCriminal.lastSeen,
                status: selectedCriminal.status,
                record: selectedCriminal.record,
            })], { type: "application/json" })
        );
        if (selectedCriminal.photo instanceof File) {
            formData.append("photoFile", selectedCriminal.photo);
        }

        try {
            const response = await fetch(`http://localhost:8081/api/criminals/${selectedCriminal.id}`, {
                method: "PUT",
                body: formData,
            });
            if (!response.ok) throw new Error(await response.text() || "Failed to update");

            const updated = await response.json();
            if (!(selectedCriminal.photo instanceof File)) {
                updated.photo = selectedCriminal.photo;
            }

            setSuspects(prev => prev.map(c => c.id === updated.id ? updated : c));
            setSelectedCriminal(null);
            setAlertMessage("Criminal updated successfully!");
            setShowAddModal(false);
        } catch (err) {
            setAlertMessage("Error updating criminal: " + (err instanceof Error ? err.message : "Unknown"));
        }
    };

    const handleDetailDelete = async (id: number) => {
        await handleDelete(id);
        setSelectedCriminal(null);
    };

    // Pagination calculations
    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    const currentRecords = filteredSuspects.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredSuspects.length / recordsPerPage) || 1;

    if (loading) return <p className="text-center mt-10">Loading criminal records...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
            <Header />
            <main className="container mx-auto p-6 space-y-6">

                {/* Back Button */}
                <Button variant="outline" onClick={() => navigate("/dashboard")} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Button>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-foreground">Criminal Records</h1>
                    <Button onClick={() => setShowAddModal(true)}>Add Criminal</Button>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <Input
                        placeholder="Search by name or crime..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Criminal Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
                    {currentRecords.map((suspect) => (
                        <Card
                            key={suspect.id}
                            className="relative flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                            onClick={() => setSelectedCriminal(suspect)}
                        >
                            <div className="flex-1 space-y-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{suspect.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{suspect.crime}</p>
                                <div className="flex flex-wrap gap-2 mt-1 text-xs">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Age: {suspect.age || "-"}</span>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Threat: {suspect.threat}</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Status: {suspect.status}</span>
                                </div>
                                {suspect.lastSeen && <p className="text-sm text-gray-500 mt-1">Last Seen: {suspect.lastSeen}</p>}
                            </div>
                            <div className="relative w-20 h-20 ml-4 flex-shrink-0">
                                <img
                                    src={
                                        typeof suspect.photo === "string"
                                            ? suspect.photo
                                            : suspect.preview
                                                ? suspect.preview
                                                : "/images/default-criminal.jpg"
                                    }
                                    alt={suspect.name}
                                    className="object-cover w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2 mt-4">
                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</Button>
                    <span>{currentPage} / {totalPages}</span>
                    <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
                </div>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showAddModal && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4"
                                initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold">{editingCriminal ? "Edit Criminal Record" : "Add Criminal Record"}</h2>
                                    <Button variant="ghost" size="icon" onClick={() => { setShowAddModal(false); setEditingCriminal(null); }}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <form className="space-y-3" onSubmit={handleAddOrEditCriminal}>
                                    <Input name="name" placeholder="Name" value={newCriminal.name} onChange={handleChange} required />
                                    <Input type="number" name="age" placeholder="Age" value={newCriminal.age} onChange={handleChange} />
                                    <Input name="crime" placeholder="Crime" value={newCriminal.crime} onChange={handleChange} required />
                                    <Input name="lastSeen" placeholder="Last Seen Location" value={newCriminal.lastSeen} onChange={handleChange} />

                                    <Select onValueChange={(val) => setNewCriminal({ ...newCriminal, threat: val })} value={newCriminal.threat}>
                                        <SelectTrigger><SelectValue placeholder="Threat Level" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select onValueChange={(val) => setNewCriminal({ ...newCriminal, status: val })} value={newCriminal.status}>
                                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Wanted">Wanted</SelectItem>
                                            <SelectItem value="Captured">Captured</SelectItem>
                                            <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Textarea name="record" placeholder="Criminal Record Summary" value={newCriminal.record} onChange={handleChange} />

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Photo</label>
                                        <Input type="file" accept="image/*" onChange={handlePhotoChange} />
                                        <div className="mt-2 w-24 h-24 rounded-md overflow-hidden">
                                            <img src={newCriminal.preview || "/images/default-criminal.jpg"} alt="Preview" className="object-cover w-full h-full" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" type="button" onClick={() => { setShowAddModal(false); setEditingCriminal(null); }}>Cancel</Button>
                                        <Button type="submit">{editingCriminal ? "Update" : "Add"}</Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Detail Modal */}
                <AnimatePresence>
                    {selectedCriminal && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4"
                                initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold">Criminal Details</h2>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedCriminal(null)}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <form className="space-y-3" onSubmit={handleUpdateCriminal}>
                                    <Input name="name" placeholder="Name" value={selectedCriminal.name} onChange={handleDetailChange} required />
                                    <Input type="number" name="age" placeholder="Age" value={selectedCriminal.age} onChange={handleDetailChange} />
                                    <Input name="crime" placeholder="Crime" value={selectedCriminal.crime} onChange={handleDetailChange} required />
                                    <Input name="lastSeen" placeholder="Last Seen Location" value={selectedCriminal.lastSeen} onChange={handleDetailChange} />

                                    <Select onValueChange={(val) => setSelectedCriminal({ ...selectedCriminal, threat: val })} value={selectedCriminal.threat}>
                                        <SelectTrigger><SelectValue placeholder="Threat Level" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select onValueChange={(val) => setSelectedCriminal({ ...selectedCriminal, status: val })} value={selectedCriminal.status}>
                                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Wanted">Wanted</SelectItem>
                                            <SelectItem value="Captured">Captured</SelectItem>
                                            <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Textarea name="record" placeholder="Criminal Record Summary" value={selectedCriminal.record} onChange={handleDetailChange} />

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Photo</label>
                                        <Input type="file" accept="image/*" onChange={(e) => handlePhotoChange(e, true)} />
                                        <div className="mt-2 w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                                            <img
                                                src={
                                                    selectedCriminal.preview
                                                        ? selectedCriminal.preview
                                                        : typeof selectedCriminal.photo === "string"
                                                            ? selectedCriminal.photo
                                                            : "/images/default-criminal.jpg"
                                                }
                                                alt="Preview"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="destructive" type="button" onClick={() => handleDetailDelete(selectedCriminal.id!)}>
                                            Delete
                                        </Button>
                                        <Button type="submit">Update</Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Alert */}
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
