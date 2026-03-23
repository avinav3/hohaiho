import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import harrierImage from "../pages/images/Harrier.png";
import { toast } from "react-toastify";

function Login() {
  const [mydata, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!mydata.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(mydata.email))
      newErrors.email = "Email format is invalid";

    if (!mydata.password) newErrors.password = "Password is required";
    else if (mydata.password.length < 6)
      newErrors.password = "Password should be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (event) => {
    setData((prevData) => ({
      ...prevData,
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
      email: mydata.email,
      password: mydata.password,
    };

    axios
      .post(`${API_BASE_URL}/login`, data)
      .then((response) => {
        if (response.data.flag === "1") {
          // alert("Successfully logged in");
          toast.success("Successfully logged in");
          const name = response.data.name;
          const id = response.data.id;
          const role = response.data.role;

          localStorage.setItem("name", name);
          localStorage.setItem("id", id);
          localStorage.setItem("role", role);

          window.location = "/Dashboard";
        } else {
          toast.error("You entered the wrong email ID or password");
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* LEFT SECTION */}
      <div className="lg:w-1/2 flex flex-col p-8 m-32 bg-gray-200">
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <Link to="/signup">
            <button className="px-6 py-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-full font-medium transition-all duration-300 hover:scale-105">
              SIGN UP
            </button>
          </Link>

          <button className="px-6 py-2 bg-white text-gray-800 rounded-full font-medium shadow-sm transition-all duration-300 hover:scale-105">
            LOGIN
          </button>
        </div>

        <form onSubmit={submitValue} className="max-w-xl space-y-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Login to your Account
          </h2>

          <p className="text-gray-600 mb-8">
            Welcome back to RENTGO! Select method to Login
          </p>

          {/* EMAIL */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-500" />

            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={onChange}
              className={`w-full pl-12 pr-4 py-3 bg-white border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none`}
            />
          </div>

          {errors.email && (
            <small className="text-red-500">{errors.email}</small>
          )}

          {/* PASSWORD */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-500" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={onChange}
              className={`w-full pl-12 pr-12 py-3 bg-white border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none`}
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {errors.password && (
            <small className="text-red-500">{errors.password}</small>
          )}

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <Link
              to="/forgotpassword"
              className="text-sm text-gray-700 hover:text-amber-600 underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            Login
          </button>

          {/* SIGNUP */}
          <p className="text-center text-sm text-gray-600 mt-6">
            No account?{" "}
            <Link
              to="/signup"
              className="text-amber-600 font-semibold underline"
            >
              Create one
            </Link>
          </p>

          {/* ADMIN LOGIN */}
          <p className="text-center text-sm text-gray-600">
            Are you an admin?{" "}
            <Link
              to="/adminlogin"
              className="text-amber-600 font-semibold underline"
            >
              Admin Login
            </Link>
          </p>
        </form>
      </div>

      {/* RIGHT IMAGE SECTION */}
      <div className="hidden lg:flex items-center justify-center p-8 mx-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500 blur-3xl rounded-full opacity-20"></div>

          <img
            src={harrierImage}
            alt="Tata Harrier"
            className="relative w-[900px] object-contain "
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
