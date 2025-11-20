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

    // FIR fields
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

    evidenceFiles?: File[] | null;
}

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
            record:
                "Involved in multiple theft cases in local trains and crowded markets.",
            complainantName: "Amit Sharma",
            complainantMobile: "9876543210",
            complainantAddress: "Sector 12, Navi Mumbai",
            incidentDate: "2024-02-10",
            incidentTime: "14:30",
            incidentLocation: "CST Station, Mumbai",
            incidentType: "Theft",
            incidentDescription:
                "Suspect stole a backpack containing valuable electronics.",
            accusedName: "Unknown",
            victimName: "Amit Sharma",
            photo: "/images/default-criminal.jpg",
        },

        {
            id: 2,
            name: "Sanjay Naik",
            age: 34,
            crime: "Assault",
            lastSeen: "Hyderabad Banjara Hills",
            threat: "High",
            status: "Under Investigation",
            record:
                "Accused of involvement in a violent altercation outside a nightclub.",
            complainantName: "Rahul Singh",
            complainantMobile: "9123456780",
            complainantAddress: "Banjara Hills, Hyderabad",
            incidentDate: "2024-01-25",
            incidentTime: "23:15",
            incidentLocation: "Night Owl Club, Hyderabad",
            incidentType: "Assault",
            incidentDescription:
                "Victim was physically attacked leading to minor injuries.",
            accusedName: "Sanjay Naik",
            victimName: "Rahul Singh",
            photo: "/images/default-criminal.jpg",
        },

        {
            id: 3,
            name: "Priya Shetty",
            age: 26,
            crime: "Cyber Crime",
            lastSeen: "Bangalore Electronic City",
            threat: "Low",
            status: "Captured",
            record:
                "Involved in online scam targeting senior citizens through phishing calls.",
            complainantName: "Suresh Kumar",
            complainantMobile: "9988776655",
            complainantAddress: "HSR Layout, Bangalore",
            incidentDate: "2024-03-12",
            incidentTime: "11:45",
            incidentLocation: "Online",
            incidentType: "Cyber Crime",
            incidentDescription:
                "Used fake bank verification calls to collect OTPs from victims.",
            accusedName: "Priya Shetty",
            victimName: "Multiple victims",
            photo: "/images/default-criminal.jpg",
        },

        {
            id: 4,
            name: "Mohammed Irfan",
            age: 30,
            crime: "Fraud",
            lastSeen: "Pune City Mall",
            threat: "Medium",
            status: "Wanted",
            record:
                "Involved in credit card fraud rings operating across Maharashtra.",
            complainantName: "Akshay Patil",
            complainantMobile: "9090909090",
            complainantAddress: "Kothrud, Pune",
            incidentDate: "2024-02-05",
            incidentTime: "16:00",
            incidentLocation: "Pune City Mall",
            incidentType: "Fraud",
            incidentDescription:
                "Used cloned credit cards to purchase high-value items.",
            accusedName: "Mohammed Irfan",
            victimName: "Multiple cardholders",
            photo: "/images/default-criminal.jpg",
        },
    ];

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

        complainantName: "",
        complainantMobile: "",
        complainantAddress: "",

        incidentDate: "",
        incidentTime: "",
        incidentLocation: "",
        incidentType: "",
        incidentDescription: "",

        accusedName: "",
        victimName: "",
        evidenceFiles: null,
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

    // Form handlers
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setNewCriminal((prev) => ({
            ...prev,
            [name]: name === "age" ? (value === "" ? "" : Number(value)) : value,
        }));
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
                } else {
                    setNewCriminal({
                        ...newCriminal,
                        photo: file,
                        preview: reader.result as string,
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddOrEditCriminal = async (e: FormEvent) => {
        e.preventDefault();
        if (!newCriminal.name || !newCriminal.crime)
            return alert("Name and Crime are required!");

        const formData = new FormData();
        formData.append(
            "criminal",
            new Blob(
                [
                    JSON.stringify({
                        name: newCriminal.name,
                        age: newCriminal.age,
                        crime: newCriminal.crime,
                        threat: newCriminal.threat,
                        lastSeen: newCriminal.lastSeen,
                        status: newCriminal.status,
                        record: newCriminal.record,

                        complainantName: newCriminal.complainantName,
                        complainantMobile: newCriminal.complainantMobile,
                        complainantAddress: newCriminal.complainantAddress,

                        incidentDate: newCriminal.incidentDate,
                        incidentTime: newCriminal.incidentTime,
                        incidentLocation: newCriminal.incidentLocation,
                        incidentType: newCriminal.incidentType,
                        incidentDescription: newCriminal.incidentDescription,

                        accusedName: newCriminal.accusedName,
                        victimName: newCriminal.victimName,
                    }),
                ],
                { type: "application/json" }
            )
        );

        if (newCriminal.photo instanceof File)
            formData.append("photoFile", newCriminal.photo);

        if (newCriminal.evidenceFiles) {
            newCriminal.evidenceFiles.forEach((file) =>
                formData.append("evidenceFiles", file)
            );
        }

        try {
            const response = await fetch(
                editingCriminal
                    ? `http://localhost:8081/api/criminals/${editingCriminal.id}`
                    : "http://localhost:8081/api/criminals",
                {
                    method: editingCriminal ? "PUT" : "POST",
                    body: formData,
                }
            );

            if (!response.ok)
                throw new Error(
                    (await response.text()) || "Failed to add/edit criminal"
                );

            const savedCriminal = await response.json();
            if (editingCriminal) {
                setSuspects((prev) =>
                    prev.map((c) =>
                        c.id === savedCriminal.id ? savedCriminal : c
                    )
                );
            } else {
                setSuspects((prev) => [...prev, savedCriminal]);
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

                complainantName: "",
                complainantMobile: "",
                complainantAddress: "",

                incidentDate: "",
                incidentTime: "",
                incidentLocation: "",
                incidentType: "",
                incidentDescription: "",

                accusedName: "",
                victimName: "",
                evidenceFiles: null,
            });
        } catch (err) {
            console.error("Error adding/editing criminal:", err);
            alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this criminal?")) return;
        try {
            const response = await fetch(
                `http://localhost:8081/api/criminals/${id}`,
                { method: "DELETE" }
            );
            if (!response.ok) throw new Error("Failed to delete criminal");
            setSuspects((prev) => prev.filter((c) => c.id !== id));
            setAlertMessage("Criminal deleted successfully!");
        } catch (err) {
            console.error("Error deleting criminal:", err);
            setAlertMessage(
                "Error deleting criminal: " +
                (err instanceof Error ? err.message : "Unknown")
            );
        }
    };

    const handleEdit = (criminal: CriminalFormData) => {
        setEditingCriminal(criminal);
        setNewCriminal({
            ...criminal,
            age: criminal.age || "",
            preview:
                typeof criminal.photo === "string"
                    ? criminal.photo
                    : criminal.preview || null,
        });
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

    const handleUpdateCriminal = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedCriminal) return;

        const formData = new FormData();
        formData.append(
            "criminal",
            new Blob(
                [
                    JSON.stringify({
                        name: selectedCriminal.name,
                        age: selectedCriminal.age,
                        crime: selectedCriminal.crime,
                        threat: selectedCriminal.threat,
                        lastSeen: selectedCriminal.lastSeen,
                        status: selectedCriminal.status,
                        record: selectedCriminal.record,

                        complainantName: selectedCriminal.complainantName,
                        complainantMobile: selectedCriminal.complainantMobile,
                        complainantAddress: selectedCriminal.complainantAddress,

                        incidentDate: selectedCriminal.incidentDate,
                        incidentTime: selectedCriminal.incidentTime,
                        incidentLocation: selectedCriminal.incidentLocation,
                        incidentType: selectedCriminal.incidentType,
                        incidentDescription: selectedCriminal.incidentDescription,

                        accusedName: selectedCriminal.accusedName,
                        victimName: selectedCriminal.victimName,
                    }),
                ],
                { type: "application/json" }
            )
        );

        if (selectedCriminal.photo instanceof File)
            formData.append("photoFile", selectedCriminal.photo);

        try {
            const response = await fetch(
                `http://localhost:8081/api/criminals/${selectedCriminal.id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );
            if (!response.ok)
                throw new Error(
                    (await response.text()) || "Failed to update criminal"
                );

            const updated = await response.json();

            if (!(selectedCriminal.photo instanceof File)) {
                updated.photo = selectedCriminal.photo;
            }

            setSuspects((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c))
            );
            setSelectedCriminal(null);
            setAlertMessage("Criminal updated successfully!");
        } catch (err) {
            setAlertMessage(
                "Error updating criminal: " +
                (err instanceof Error ? err.message : "Unknown")
            );
        }
    };

    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    const currentRecords = filteredSuspects.slice(
        indexOfFirst,
        indexOfLast
    );
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

                <div className="grid grid-col-1  sm:grid-cols-4 gap-6">
                    {criminalData.map((suspect) => (
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
                            </div>
                            <div className="relative w-20 h-20 ml-4 flex-shrink-0">
                                {/* <img
                                    src={
                                        typeof suspect.photo === "string"
                                            ? suspect.photo
                                            : suspect.preview
                                                ? suspect.preview
                                                : "/images/default-criminal.jpg"
                                    }
                                    alt={suspect.name}
                                    className="object-cover w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                /> */}
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
                <AnimatePresence>
                    {showAddModal && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg
                           p-6 space-y-4 max-h-[75vh] overflow-y-auto"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                            >
                                <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 pb-2">
                                    <h2 className="text-2xl font-semibold">
                                        {editingCriminal
                                            ? "Edit Case Record"
                                            : "Add Case Record"}
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingCriminal(null);
                                        }}
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <form className="space-y-3" onSubmit={handleAddOrEditCriminal}>
                                    <Input
                                        name="name"
                                        placeholder="Name"
                                        value={newCriminal.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        type="number"
                                        name="age"
                                        placeholder="Age"
                                        value={newCriminal.age}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="crime"
                                        placeholder="Crime"
                                        value={newCriminal.crime}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        name="lastSeen"
                                        placeholder="Last Seen Location"
                                        value={newCriminal.lastSeen}
                                        onChange={handleChange}
                                    />

                                    <Select
                                        onValueChange={(val) =>
                                            setNewCriminal({ ...newCriminal, threat: val })
                                        }
                                        value={newCriminal.threat}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Threat Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        onValueChange={(val) =>
                                            setNewCriminal({ ...newCriminal, status: val })
                                        }
                                        value={newCriminal.status}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Wanted">Wanted</SelectItem>
                                            <SelectItem value="Captured">Captured</SelectItem>
                                            <SelectItem value="Under Investigation">
                                                Under Investigation
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Textarea
                                        name="record"
                                        placeholder="Criminal Record Summary"
                                        value={newCriminal.record}
                                        onChange={handleChange}
                                    />

                                    <h3 className="font-semibold mt-4">Complainant Details</h3>
                                    <Input
                                        name="complainantName"
                                        placeholder="Complainant Name"
                                        value={newCriminal.complainantName}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="complainantMobile"
                                        placeholder="Complainant Mobile"
                                        value={newCriminal.complainantMobile}
                                        onChange={handleChange}
                                    />
                                    <Textarea
                                        name="complainantAddress"
                                        placeholder="Complainant Address"
                                        value={newCriminal.complainantAddress}
                                        onChange={handleChange}
                                    />

                                    <h3 className="font-semibold mt-4">Incident Details</h3>
                                    <Input
                                        type="date"
                                        name="incidentDate"
                                        value={newCriminal.incidentDate}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        type="time"
                                        name="incidentTime"
                                        value={newCriminal.incidentTime}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="incidentLocation"
                                        placeholder="Incident Location"
                                        value={newCriminal.incidentLocation}
                                        onChange={handleChange}
                                    />

                                    <Select
                                        value={newCriminal.incidentType}
                                        onValueChange={(val) =>
                                            setNewCriminal({ ...newCriminal, incidentType: val })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Incident Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Theft">Theft</SelectItem>
                                            <SelectItem value="Assault">Assault</SelectItem>
                                            <SelectItem value="Harassment">Harassment</SelectItem>
                                            <SelectItem value="Fraud">Fraud</SelectItem>
                                            <SelectItem value="Cyber Crime">Cyber Crime</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Textarea
                                        name="incidentDescription"
                                        placeholder="Incident Description"
                                        value={newCriminal.incidentDescription}
                                        onChange={handleChange}
                                    />

                                    <h3 className="font-semibold mt-4">Accused / Victim</h3>
                                    <Input
                                        name="accusedName"
                                        placeholder="Accused Name (optional)"
                                        value={newCriminal.accusedName}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="victimName"
                                        placeholder="Victim Name (optional)"
                                        value={newCriminal.victimName}
                                        onChange={handleChange}
                                    />

                                    <h3 className="font-semibold mt-4">Evidence (Optional)</h3>
                                    <Input
                                        type="file"
                                        accept="image/*,video/*,.pdf,.jpg,.png"
                                        multiple
                                        onChange={(e) => {
                                            const files = e.target.files
                                                ? Array.from(e.target.files)
                                                : [];
                                            setNewCriminal({
                                                ...newCriminal,
                                                evidenceFiles: files,
                                            });
                                        }}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Photo
                                        </label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                        />
                                        <div className="mt-2 w-24 h-24 rounded-md overflow-hidden">
                                            <img
                                                src={
                                                    newCriminal.preview ||
                                                    "/images/default-criminal.jpg"
                                                }
                                                alt="Preview"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white dark:bg-gray-900">
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setEditingCriminal(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            {editingCriminal ? "Update" : "Add"}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {selectedCriminal && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg
                           p-6 space-y-4 max-h-[75vh] overflow-y-auto"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                            >
                                <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 pb-3">
                                    <h2 className="text-2xl font-semibold">
                                        Case Details
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedCriminal(null)}
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <form
                                    className="space-y-3"
                                    onSubmit={handleUpdateCriminal}
                                >
                                    <Input
                                        name="name"
                                        placeholder="Name"
                                        value={selectedCriminal.name}
                                        onChange={handleDetailChange}
                                        required
                                    />
                                    <Input
                                        type="number"
                                        name="age"
                                        placeholder="Age"
                                        value={selectedCriminal.age}
                                        onChange={handleDetailChange}
                                    />
                                    <Input
                                        name="crime"
                                        placeholder="Crime"
                                        value={selectedCriminal.crime}
                                        onChange={handleDetailChange}
                                        required
                                    />
                                    <Input
                                        name="lastSeen"
                                        placeholder="Last Seen Location"
                                        value={selectedCriminal.lastSeen}
                                        onChange={handleDetailChange}
                                    />

                                    <Select
                                        onValueChange={(val) =>
                                            setSelectedCriminal({
                                                ...selectedCriminal,
                                                threat: val,
                                            })
                                        }
                                        value={selectedCriminal.threat}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Threat Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        onValueChange={(val) =>
                                            setSelectedCriminal({
                                                ...selectedCriminal,
                                                status: val,
                                            })
                                        }
                                        value={selectedCriminal.status}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Wanted">Wanted</SelectItem>
                                            <SelectItem value="Captured">Captured</SelectItem>
                                            <SelectItem value="Under Investigation">
                                                Under Investigation
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Textarea
                                        name="record"
                                        placeholder="Criminal Record Summary"
                                        value={selectedCriminal.record}
                                        onChange={handleDetailChange}
                                    />

                                    <h3 className="font-semibold mt-4">
                                        Complainant Details
                                    </h3>
                                    <Input
                                        name="complainantName"
                                        placeholder="Complainant Name"
                                        value={selectedCriminal.complainantName}
                                        onChange={handleDetailChange}
                                    />
                                    <Input
                                        name="complainantMobile"
                                        placeholder="Complainant Mobile"
                                        value={selectedCriminal.complainantMobile}
                                        onChange={handleDetailChange}
                                    />
                                    <Textarea
                                        name="complainantAddress"
                                        placeholder="Complainant Address"
                                        value={selectedCriminal.complainantAddress}
                                        onChange={handleDetailChange}
                                    />

                                    <h3 className="font-semibold mt-4">
                                        Incident Details
                                    </h3>
                                    <Input
                                        type="date"
                                        name="incidentDate"
                                        value={selectedCriminal.incidentDate}
                                        onChange={handleDetailChange}
                                    />
                                    <Input
                                        type="time"
                                        name="incidentTime"
                                        value={selectedCriminal.incidentTime}
                                        onChange={handleDetailChange}
                                    />
                                    <Input
                                        name="incidentLocation"
                                        placeholder="Incident Location"
                                        value={selectedCriminal.incidentLocation}
                                        onChange={handleDetailChange}
                                    />

                                    <Select
                                        value={selectedCriminal.incidentType}
                                        onValueChange={(val) =>
                                            setSelectedCriminal({
                                                ...selectedCriminal,
                                                incidentType: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Incident Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Theft">Theft</SelectItem>
                                            <SelectItem value="Assault">Assault</SelectItem>
                                            <SelectItem value="Harassment">Harassment</SelectItem>
                                            <SelectItem value="Fraud">Fraud</SelectItem>
                                            <SelectItem value="Cyber Crime">
                                                Cyber Crime
                                            </SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Textarea
                                        name="incidentDescription"
                                        placeholder="Incident Description"
                                        value={selectedCriminal.incidentDescription}
                                        onChange={handleDetailChange}
                                    />

                                    <h3 className="font-semibold mt-4">
                                        Accused / Victim
                                    </h3>
                                    <Input
                                        name="accusedName"
                                        placeholder="Accused Name (optional)"
                                        value={selectedCriminal.accusedName}
                                        onChange={handleDetailChange}
                                    />
                                    <Input
                                        name="victimName"
                                        placeholder="Victim Name (optional)"
                                        value={selectedCriminal.victimName}
                                        onChange={handleDetailChange}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Photo
                                        </label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handlePhotoChange(e, true)}
                                        />
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

                                    <div className="flex justify-end gap-2 sticky bottom-0 pt-3 bg-white dark:bg-gray-900">
                                        <Button
                                            variant="destructive"
                                            type="button"
                                            onClick={() =>
                                                handleDelete(selectedCriminal.id!)
                                            }
                                        >
                                            Delete
                                        </Button>
                                        <Button type="submit">Update</Button>
                                    </div>
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
