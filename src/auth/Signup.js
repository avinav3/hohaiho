import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import TermsAndConditions from "../legal/terms&conditions";
import PrivacyPolicy from "../legal/privacy policy";
import harrierImage from "../pages/images/Harrier.png";

function Signup() {
  const [mydata, myDataUpdate] = React.useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!mydata.name) newErrors.name = "Name is required";
    if (!mydata.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(mydata.email))
      newErrors.email = "Email format is invalid";

    if (!mydata.mobile) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(mydata.mobile))
      newErrors.mobile = "Mobile number should be 10 digits";

    if (!mydata.password) newErrors.password = "Password is required";
    else if (mydata.password.length < 6)
      newErrors.password = "Password should be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (event) => {
    myDataUpdate((mydata) => ({
      ...mydata,
      [event.target.name]: event.target.value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [event.target.name]: "",
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitValue = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const data = {
      name: mydata.name,
      email: mydata.email,
      mobileno: mydata.mobile,
      password: mydata.password,
    };

    axios
      .post(`${API_BASE_URL}/register`, data)
      .then(function (response) {
        const msg = response.data.message;
        alert(msg);
        window.location = "/login";
      })
      .catch(function (error) {
        console.error("There was an error!", error);
      });
  };

  const openTerms = () => setIsTermsOpen(true);
  const closeTerms = () => setIsTermsOpen(false);

  const openPrivacy = () => setIsPrivacyOpen(true);
  const closePrivacy = () => setIsPrivacyOpen(false);

  return (
    <div className="min-h-screen bg-gray-200 flex">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
      {/* LEFT SECTION */}
      <div className="lg:w-1/2 flex flex-col p-10 m-20 bg-gray-200">
        <div className="flex gap-4 mb-8">
          <button className="px-6 py-2 bg-white text-gray-800 rounded-full font-medium shadow-sm">
            SIGN UP
          </button>

          <Link to="/login">
            <button className="px-6 py-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-full font-medium">
              LOGIN
            </button>
          </Link>
        </div>

        <form onSubmit={submitValue} className="max-w-xl space-y-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Sign Up to your Account
          </h2>

          <p className="text-gray-600 mb-6">
            Welcome to RENTGO! Create your account
          </p>

          {/* NAME */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={onChange}
              className={`w-full pl-12 pr-4 py-3 bg-white border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none`}
            />
          </div>
          {errors.name && <small className="text-red-500">{errors.name}</small>}

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={onChange}
              className={`w-full pl-12 pr-4 py-3 bg-white border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none`}
            />
          </div>

          {errors.email && (
            <small className="text-red-500">{errors.email}</small>
          )}

          {/* MOBILE */}
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            maxLength="10"
            onChange={onChange}
            className={`w-full px-4 py-3 bg-white border ${
              errors.mobile ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none`}
          />

          {errors.mobile && (
            <small className="text-red-500">{errors.mobile}</small>
          )}

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={onChange}
              className={`w-full pl-12 pr-12 py-3 bg-white border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none`}
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {errors.password && (
            <small className="text-red-500">{errors.password}</small>
          )}

          {/* TERMS */}
          <div className="text-sm text-gray-700 mt-4">
            By signing up, you agree to our{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openTerms();
              }}
              className="text-amber-600 font-semibold hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openPrivacy();
              }}
              className="text-amber-600 font-semibold hover:underline"
            >
              Privacy Policy
            </a>
          </div>

          <TermsAndConditions isOpen={isTermsOpen} onClose={closeTerms} />
          <PrivacyPolicy isOpen={isPrivacyOpen} onClose={closePrivacy} />

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-600 font-semibold underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:flex items-center justify-center p-8 mx-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500 blur-3xl rounded-full opacity-20"></div>

          <img
            src={harrierImage}
            alt="Tata Harrier"
            className="relative w-[900px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
