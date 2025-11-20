import { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
import { X, User, UserCheck, Calendar, FileText, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CriminalFormData {
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

interface CriminalModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    editingCriminal: CriminalFormData | null;
    setEditingCriminal: (criminal: CriminalFormData | null) => void;
    onSubmit: (criminal: CriminalFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export const CriminalModal: React.FC<CriminalModalProps> = ({
    showModal,
    setShowModal,
    editingCriminal,
    setEditingCriminal,
    onSubmit,
    isSubmitting = false
}) => {
    const [newCriminal, setNewCriminal] = useState<CriminalFormData>({
        name: "",
        age: "",
        crime: "",
        threat: "Low",
        lastSeen: "",
        status: "Pending",
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

    // Initialize form when editing
    useEffect(() => {
        if (editingCriminal) {
            setNewCriminal(editingCriminal);
        } else {
            // Reset form when adding new
            setNewCriminal({
                name: "",
                age: "",
                crime: "",
                threat: "Low",
                lastSeen: "",
                status: "Pending",
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
        }
    }, [editingCriminal, showModal]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCriminal(prev => ({
            ...prev,
            [name]: name === "age" ? (value === "" ? "" : Number(value)) : value
        }));
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setNewCriminal(prev => ({
                ...prev,
                photo: file,
                preview: previewUrl
            }));
        }
    };

    const handleReportUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('Report file selected:', file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(newCriminal);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingCriminal(null);
    };

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-4"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {editingCriminal ? "Edit Case Record" : "Add New Case Record"}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {editingCriminal ? `Case ID: ${editingCriminal.id}` : 'Create new criminal case'}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClose}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="max-h-[75vh] overflow-y-auto">
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Criminal Information Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <User className="w-5 h-5" />
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
                                                value={newCriminal.name}
                                                onChange={handleChange}
                                                required
                                                className="dark:bg-gray-800 dark:border-gray-700"
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
                                                value={newCriminal.age}
                                                onChange={handleChange}
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Crime <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                name="crime"
                                                placeholder="Enter crime committed"
                                                value={newCriminal.crime}
                                                onChange={handleChange}
                                                required
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Last Seen Location
                                            </label>
                                            <Input
                                                name="lastSeen"
                                                placeholder="Enter last known location"
                                                value={newCriminal.lastSeen}
                                                onChange={handleChange}
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Threat Level
                                            </label>
                                            <Select
                                                onValueChange={(val) =>
                                                    setNewCriminal({ ...newCriminal, threat: val })
                                                }
                                                value={newCriminal.threat}
                                            >
                                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
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
                                                    setNewCriminal({ ...newCriminal, status: val })
                                                }
                                                value={newCriminal.status}
                                            >
                                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                    <SelectItem value="In-Progress">In-Progress</SelectItem>
                                                    <SelectItem value="Closed">Closed</SelectItem>
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
                                                value={newCriminal.record}
                                                onChange={handleChange}
                                                className="min-h-[100px] dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Complainant Details Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <UserCheck className="w-5 h-5" />
                                        Complainant Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Complainant Name
                                            </label>
                                            <Input
                                                name="complainantName"
                                                placeholder="Enter complainant name"
                                                value={newCriminal.complainantName}
                                                onChange={handleChange}
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Complainant Mobile
                                            </label>
                                            <Input
                                                name="complainantMobile"
                                                placeholder="Enter complainant mobile number"
                                                value={newCriminal.complainantMobile}
                                                onChange={handleChange}
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Complainant Address
                                            </label>
                                            <Textarea
                                                name="complainantAddress"
                                                placeholder="Enter complainant address"
                                                value={newCriminal.complainantAddress}
                                                onChange={handleChange}
                                                className="min-h-[80px] dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Incident Details Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Incident Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Incident Date
                                            </label>
                                            <Input
                                                type="date"
                                                name="incidentDate"
                                                value={newCriminal.incidentDate}
                                                onChange={handleChange}
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Incident Time
                                            </label>
                                            <Input
                                                type="time"
                                                name="incidentTime"
                                                value={newCriminal.incidentTime}
                                                onChange={handleChange}
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Incident Location
                                            </label>
                                            <Input
                                                name="incidentLocation"
                                                placeholder="Enter incident location"
                                                value={newCriminal.incidentLocation}
                                                onChange={handleChange}
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Incident Type
                                            </label>
                                            <Select
                                                value={newCriminal.incidentType}
                                                onValueChange={(val) =>
                                                    setNewCriminal({ ...newCriminal, incidentType: val })
                                                }
                                            >
                                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                                    <SelectValue placeholder="Select incident type" />
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
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Incident Description
                                            </label>
                                            <Textarea
                                                name="incidentDescription"
                                                placeholder="Enter detailed incident description"
                                                value={newCriminal.incidentDescription}
                                                onChange={handleChange}
                                                className="min-h-[100px] dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Accused / Victim Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Accused / Victim Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Accused Name
                                            </label>
                                            <Input
                                                name="accusedName"
                                                placeholder="Enter accused name (optional)"
                                                value={newCriminal.accusedName}
                                                onChange={handleChange}
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Victim Name
                                            </label>
                                            <Input
                                                name="victimName"
                                                placeholder="Enter victim name (optional)"
                                                value={newCriminal.victimName}
                                                onChange={handleChange}
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Documents & Media Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Documents & Media
                                    </h3>
                                    
                                    {/* Photo Upload */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            Criminal Photo
                                        </label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="dark:bg-gray-800 dark:border-gray-700 mb-3"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-md overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                                                <img
                                                    src={
                                                        newCriminal.preview ||
                                                        "/images/default-criminal.jpg"
                                                    }
                                                    alt="Preview"
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Upload criminal identification photo
                                            </span>
                                        </div>
                                    </div>

                                    {/* Evidence Files */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            Additional Evidence Files
                                        </label>
                                        <Input
                                            type="file"
                                            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
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
                                            className="dark:bg-gray-800 dark:border-gray-700"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            Supported formats: Images, PDF, DOC, TXT (Max: 10MB each)
                                        </p>
                                    </div>

                                    {/* Case Report Upload */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            Upload Case Report
                                        </label>
                                        <Input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.txt"
                                            onChange={handleReportUpload}
                                            className="dark:bg-gray-800 dark:border-gray-700"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            Supported formats: PDF, DOC, DOCX, TXT (Max: 10MB)
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={handleClose}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit"
                                        className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Saving..." : editingCriminal ? "Update Case" : "Add Case"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};