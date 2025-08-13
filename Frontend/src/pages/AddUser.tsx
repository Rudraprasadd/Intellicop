import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  FaUserPlus,
  FaIdBadge,
  FaUserShield,
  FaLock,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";

interface FormData {
  photo: File | null;
  loginId: string;
  password: string;
  role: string;
}

const AddUserForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    photo: null,
    loginId: "",
    password: "",
    role: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [policeId, setPoliceId] = useState("");

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handlePoliceIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPoliceId(e.target.value);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "photo" && (e.target as HTMLInputElement).files) {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setFormData({ ...formData, photo: files[0] });
        setPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.photo) newErrors.push("Photo is required.");
    if (!formData.loginId.trim()) newErrors.push("Login ID is required.");
    if (formData.password.length < 6)
      newErrors.push("Password must be at least 6 characters.");
    if (formData.password !== confirmPassword)
      newErrors.push("Passwords do not match.");
    if (!formData.role) newErrors.push("Role is required.");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("photo", formData.photo as Blob);
    data.append("loginId", formData.loginId);
    data.append("password", formData.password);
    data.append("role", formData.role);
    data.append("policeId", policeId);

    try {
      const res = await fetch("http://localhost:8081/api/users/add", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to add user");
      }

      const result = await res.json();
      console.log("Server Response:", result); // policeId not expected here
      alert("User added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error adding user");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-8 border border-gray-200">
        <button
          onClick={() => navigate("/dashboard", { replace: true })}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-blue-700">
          <FaUserPlus /> Add New User
        </h2>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            <ul className="list-disc pl-5">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block font-medium mb-2 flex items-center gap-2">
              <FaImage /> Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-24 h-24 object-cover rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-105"
              />
            )}
          </div>

          {/* Login ID */}
          <div>
            <label className="block font-medium mb-2 flex items-center gap-2">
              <FaUserShield /> System Login ID
            </label>
            <input
              type="text"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter login ID"
            />
          </div>

          {/* Police ID */}
          <div>
            <label className="block font-medium mb-2 flex items-center gap-2">
              <FaIdBadge /> Police ID
            </label>
            <input
              type="text"
              name="policeId"
              value={policeId}
              onChange={handlePoliceIdChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter police ID"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-2 flex items-center gap-2">
              <FaLock /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-medium mb-2 flex items-center gap-2">
              <FaLock /> Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block font-medium mb-2 flex items-center gap-2">
              <FaUserShield /> Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="">Select Role</option>
              <option value="Patrol Officer">Patrol Officer</option>
              <option value="Desk Officer">Desk Officer</option>
              <option value="Field Officer">Field Officer</option>
              <option value="Investigating Officer">
                Investigating Officer
              </option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FaUserPlus /> Add User
          </button>
        </form>
      </div>
    </>
  );
};

export default AddUserForm;
