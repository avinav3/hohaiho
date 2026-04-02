import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

function Login() {
  const [mydata, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    const storedUserId = localStorage.getItem("user_id");

    if (storedId || storedUserId) {
      navigate("/Dashboard", { replace: true });
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};

    if (!mydata.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(mydata.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!mydata.password) {
      newErrors.password = "Password is required";
    } else if (mydata.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters";
    }

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
    setShowPassword((prev) => !prev);
  };

  const submitValue = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const data = {
      email: mydata.email,
      password: mydata.password,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, data);

      if (response.data.flag === "1") {
        toast.success("Successfully logged in");

        const name = response.data.name || "User";
        const id = response.data.id || "";
        const user_id = response.data.user_id || "";
        const role = response.data.role || response.data.userRole || "";

        localStorage.setItem("name", name);

        if (id) {
          localStorage.setItem("id", id);
        }

        if (user_id) {
          localStorage.setItem("user_id", user_id);
        }

        if (role) {
          localStorage.setItem("role", role);
        }

        navigate("/Dashboard", { replace: true });
      } else {
        toast.error("You entered the wrong email ID or password");
      }
    } catch (error) {
      console.error("There was an error!", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg">
        <form onSubmit={submitValue} className="space-y-6 p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Log In
          </h1>

          <input
            type="text"
            name="email"
            value={mydata.email}
            placeholder="Enter Email ID"
            onChange={onChange}
            className={`w-full px-3 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
          />
          {errors.email && (
            <small className="text-red-500">{errors.email}</small>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={mydata.password}
              placeholder="Enter Password"
              onChange={onChange}
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-black" />
              ) : (
                <Eye className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
          {errors.password && (
            <small className="text-red-500">{errors.password}</small>
          )}

          <div className="text-right">
            <Link
              to="/ForgotPassword"
              className="text-sm text-black hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Log in
          </button>

          <div className="text-center">
            <h4 className="text-sm text-gray-600">
              No account?{" "}
              <Link
                to="/signup"
                className="text-black font-semibold hover:underline"
              >
                Create one
              </Link>
            </h4>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
