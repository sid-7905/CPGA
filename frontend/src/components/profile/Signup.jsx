import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  showSuccessToast,
  showErrorToast,
  showLoaderToast
} from "../toastify.jsx";
import { toast, ToastContainer } from "react-toastify";
import { User, Mail, Lock, Camera, Home } from "lucide-react";

const Form = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [previewImage, setPreviewImage] = useState(null);

  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result; // Get the data URL of the image
        setPreviewImage(result); // Update the previewImage state
        setFormData((prevData) => ({ ...prevData, file: file })); // Update formData with the image
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const [formData, setFormData] = useState({
    file: "",
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      showErrorToast(
        "Please fill in all required fields (Name, Phone, Email, Password)"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      showErrorToast("You are already logged in. Kindly logout first.");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", formData.file);
    formdata.append("name", formData.name);
    formdata.append("username", formData.username);
    formdata.append("email", formData.email);
    formdata.append("password", formData.password);

    showLoaderToast("Creating account..."); 

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/register`,
        formdata,
        {
          withCredentials: true, // Include cookies and credentials
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // console.log(response);
      toast.dismiss();
      showSuccessToast("User added successfully"); // Notify user of success
      setFormData({
        file: "",
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

      setPreviewImage(null);
      window.location.replace("/getIds");
    } catch (err) {
      toast.dismiss();
      console.log(err?.response?.data?.message);
      showErrorToast(err?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-gray-900/50 p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#64ffda] to-cyan-300 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2">Join our community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#64ffda] shadow-lg">
                {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-6 text-gray-400 object-cover" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
                  <Camera className="w-5 h-5 text-[#64ffda]" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#64ffda]" />
                </div>
                <input
                  required
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-[#64ffda] rounded-xl outline-none text-gray-100 transition-all duration-200"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#64ffda]" />
                </div>
                <input
                  required
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-[#64ffda] rounded-xl outline-none text-gray-100 transition-all duration-200"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#64ffda]" />
                </div>
                <input
                  required
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-[#64ffda] rounded-xl outline-none text-gray-100 transition-all duration-200"
                  type="text"
                  name="username"
                  value={formData.username}
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
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#64ffda]" />
                </div>
                <input
                  required
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-[#64ffda] rounded-xl outline-none text-gray-100 transition-all duration-200"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#64ffda] to-cyan-400 text-gray-900 font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Create Account
              </button>

              <div className="flex items-center justify-center gap-1 text-sm">
                <span className="text-gray-400">Already have an account?</span>
                <Link
                  to="/login"
                  className="text-[#64ffda] hover:text-cyan-300 font-medium"
                >
                  Sign In
                </Link>
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

export default Form;
