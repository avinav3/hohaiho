import React, { useState } from "react";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Car,
  Mail,
  User,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Send,
} from "lucide-react";

const ContactUs = () => {
  document.title = "Contact";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState("");

  const [validFields, setValidFields] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const validateField = (name, value) => {
    let isValid = true;

    switch (name) {
      case "name":
        isValid = value.trim() !== "";
        break;
      case "email":
        isValid = /\S+@\S+\.\S+/.test(value);
        break;
      case "subject":
        isValid = value.trim() !== "";
        break;
      case "message":
        isValid = value.trim() !== "";
        break;
      default:
        break;
    }

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    const isValid = validateField(name, value);

    setValidFields({ ...validFields, [name]: isValid });

    setFormErrors({ ...formErrors, [name]: isValid ? "" : formErrors[name] });
  };

  const validateForm = () => {
    const errors = {};

    Object.keys(formData).forEach((field) => {
      const isValid = validateField(field, formData[field]);

      if (!isValid) {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is invalid.`;
      }
    });

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus("Submitting...");

    emailjs
      .send(
        "service_lgw35k6",
        "template_5og35je",
        formData,
        "ONjVU4JX02FTox56b",
      )
      .then(
        (response) => {
          setFormStatus("");

          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });

          setFormErrors({});

          setValidFields({
            name: false,
            email: false,
            subject: false,
            message: false,
          });

          toast.success("Your message was sent, thank you!");
          toast.success("We will soon contact you");
        },
        () => {
          setFormStatus("");
          toast.error("Something went wrong. Please try again.");
        },
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mb-6">
            <Car className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to assist you with all your automotive needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* CONTACT INFO */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl">
                  <Phone className="text-amber-600" />
                  <p className="text-gray-700">+977 9861293369</p>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl">
                  <Mail className="text-yellow-600" />
                  <p className="text-gray-700">support@rentgo.com</p>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl">
                  <MapPin className="text-amber-600" />
                  <p className="text-gray-700">Kathmandu, Nepal</p>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl">
                  <Clock className="text-yellow-600" />
                  <p className="text-gray-700">Mon-Fri: 9AM - 6PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-100">
              {formStatus && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                  {formStatus}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                id="contactForm"
                name="contactForm"
                className="space-y-6"
              >
                {/* NAME + EMAIL */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl ${
                        formErrors.name
                          ? "border-red-500"
                          : validFields.name
                            ? "border-green-500"
                            : "border-gray-300"
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl ${
                        formErrors.email
                          ? "border-red-500"
                          : validFields.email
                            ? "border-green-500"
                            : "border-gray-300"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* SUBJECT */}
                <div className="relative">
                  <Car className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl ${
                      formErrors.subject
                        ? "border-red-500"
                        : validFields.subject
                          ? "border-green-500"
                          : "border-gray-300"
                    }`}
                  />
                  {formErrors.subject && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.subject}
                    </p>
                  )}
                </div>

                {/* MESSAGE */}
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    rows={6}
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl ${
                      formErrors.message
                        ? "border-red-500"
                        : validFields.message
                          ? "border-green-500"
                          : "border-gray-300"
                    }`}
                  />
                  {formErrors.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <Send size={20} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ContactUs;
