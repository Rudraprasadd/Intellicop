"use client";

import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { X } from "lucide-react";
import { motion } from "framer-motion";

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
}

interface Props {
  criminal?: CriminalFormData;
  onClose: () => void;
  onSave: (data: CriminalFormData) => void;
}

export default function CriminalForm({ criminal, onClose, onSave }: Props) {
  const [form, setForm] = useState<CriminalFormData>({
    name: "",
    age: "",
    crime: "",
    threat: "Low",
    lastSeen: "",
    status: "Under Investigation",
    record: "",
    photo: null,
    preview: null,
    ...criminal
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "age" ? (value === "" ? "" : Number(value)) : value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, photo: file, preview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.crime) return alert("Name and Crime are required!");
    onSave(form);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4"
        initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{criminal ? "Edit Criminal" : "Add Criminal"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <Input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} />
          <Input name="crime" placeholder="Crime" value={form.crime} onChange={handleChange} required />
          <Input name="lastSeen" placeholder="Last Seen" value={form.lastSeen} onChange={handleChange} />

          <Select value={form.threat} onValueChange={val => setForm(prev => ({ ...prev, threat: val }))}>
            <SelectTrigger><SelectValue placeholder="Threat Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={form.status} onValueChange={val => setForm(prev => ({ ...prev, status: val }))}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Wanted">Wanted</SelectItem>
              <SelectItem value="Captured">Captured</SelectItem>
              <SelectItem value="Under Investigation">Under Investigation</SelectItem>
            </SelectContent>
          </Select>

          <Textarea name="record" placeholder="Record Summary" value={form.record} onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
            <div className="mt-2 w-24 h-24 rounded-md overflow-hidden">
              <img src={form.preview || "/images/default-criminal.jpg"} alt="Preview" className="object-cover w-full h-full" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">{criminal ? "Update" : "Add"}</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
