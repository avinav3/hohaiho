import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import API_BASE_URL from "../config/apiConfig";
import {
  Mail,
  User,
  MessageSquare,
  Calendar,
  Clock,
  CarFront,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const BookServiceForm = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  useEffect(() => {
    if (!userId) {
      toast.error("Please login first!");
      navigate("/Login");
    }
  }, [userId, navigate]);
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    vehicleBrand: "",
    vehicleModel: "",
    licensePlate: "",
    preferredDate: "",
    preferredTime: "",
    serviceType: "General Service",
    additionalNotes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState("");
  const [validFields, setValidFields] = useState({});

  const validateField = (name, value) => {
    if (!value.trim()) return false;
    if (name === "email") return /\S+@\S+\.\S+/.test(value);
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const isValid = validateField(name, value);
    setValidFields((prev) => ({ ...prev, [name]: isValid }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: isValid ? "" : `${name} is invalid.`,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "contactNumber",
      "email",
      "vehicleBrand",
      "serviceType",
      "vehicleModel",
      "licensePlate",
      "preferredDate",
      "preferredTime",
    ];

    const errors = {};
    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field])) {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required.`;
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus("Submitting...");

    try {
      await axios.post(`${API_BASE_URL}/api/bookings/bookServicing`, {
        userId,
        ...formData,
      });

      toast.success("Service booking submitted!");
      setFormStatus("");
      setFormData({
        fullName: "",
        contactNumber: "",
        email: "",
        vehicleBrand: "",
        vehicleModel: "",
        licensePlate: "",
        preferredDate: "",
        preferredTime: "",
        serviceType: "General Service",
        additionalNotes: "",
      });
      setFormErrors({});
      setValidFields({});
    } catch (error) {
      console.error(error);
      toast.error("Failed to book service. Try again.");
      setFormStatus("");
    }
  };

  const inputClass = (field) =>
    `w-full pl-1 py-2 px-3 border rounded-md ${
      formErrors[field]
        ? "border-red-500"
        : validFields[field]
        ? "border-green-500"
        : "border-gray-300"
    }`;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="bg-black text-white p-8 flex items-center space-x-4 mb-4">
          <CarFront size={36} />
          <div>
            <h2 className="text-3xl font-bold">Book a Service</h2>
            <p className="text-blue-100">
              Schedule your next vehicle servicing here.
            </p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {formStatus && (
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
              {formStatus}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <User className="mr-2" size={18} /> Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    className={inputClass("fullName")}
                  />
                </div>
                {formErrors.fullName && (
                  <p className="text-sm text-red-500">{formErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <User className="mr-2" size={18} /> Contact Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    className={inputClass("contactNumber")}
                    maxLength={10}
                  />
                </div>
                {formErrors.contactNumber && (
                  <p className="text-sm text-red-500">
                    {formErrors.contactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Mail size={18} className="mr-2" /> Email (optional)
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass("email")}
                />
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="text"
                name="vehicleBrand"
                placeholder="Vehicle Brand (e.g. Toyota)"
                value={formData.vehicleBrand}
                onChange={handleChange}
                className={inputClass("vehicleBrand")}
              />
              <input
                type="text"
                name="vehicleModel"
                placeholder="Model (e.g. Corolla)"
                value={formData.vehicleModel}
                onChange={handleChange}
                className={inputClass("vehicleModel")}
              />
              <input
                type="text"
                name="licensePlate"
                placeholder="License Plate"
                value={formData.licensePlate}
                onChange={handleChange}
                className={inputClass("licensePlate")}
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className={inputClass("preferredDate")}
              />
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className={inputClass("preferredTime")}
                min="08:00"
                max="18:00"
              />
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Type</label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={inputClass("serviceType")}
              >
                <option>General Service</option>
                <option>Engine Repair</option>
                <option>AC Repair</option>
                <option>Oil Change</option>
                <option>Other</option>
              </select>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <textarea
                name="additionalNotes"
                rows={4}
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Describe the issue or request"
                className={inputClass("additionalNotes")}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-900 hover:scale-105 transition duration-300"
            >
              Book Service
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default BookServiceForm;
