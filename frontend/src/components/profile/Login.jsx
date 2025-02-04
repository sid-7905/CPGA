import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../toastify";
import { User, Mail, Lock, Camera, ArrowLeft, Home } from "lucide-react";

const Login = () => {
  const BackendUrl = process.env.REACT_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!formData.emailOrUsername || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    axios
      .post(`${BackendUrl}/api/user/login`, formData)
      .then((res) => {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/";
        showSuccessToast("Login successful");
        setError("");
      })
      .catch((err) => {
        setError(err?.response?.data?.message);
      });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {error && (
          <>
            {showErrorToast(error)}
            {setError("")}
          </>
        )}

        <div className="backdrop-blur-lg bg-gray-900/50 p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#64ffda] to-cyan-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#64ffda]" />
                </div>
                <input
                  required
                  placeholder="Username or Email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-[#64ffda] rounded-xl outline-none text-gray-100 transition-all duration-200"
                  type="text"
                  name="emailOrUsername"
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#64ffda]" />
                </div>
                <input
                  required
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-[#64ffda] rounded-xl outline-none text-gray-100 transition-all duration-200"
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#64ffda] to-cyan-400 text-gray-900 font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign In
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forgot-password"
                  className="text-gray-400 hover:text-[#64ffda] transition-colors"
                >
                  Forgot Password?
                </Link>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">New here?</span>
                  <Link
                    to="/register"
                    className="text-[#64ffda] hover:text-cyan-300 font-medium"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-[#64ffda] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
