import React from "react";
import { Camera, User, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { showErrorToast, showLoaderToast, showSuccessToast } from "../../toastify";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function EditUserInfo() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    fullName: user.name,
    userName: user.username,
    file: user.image,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formdata = new FormData();
    formdata.append("name", formData.fullName);
    formdata.append("username", formData.userName);
    formdata.append("file", formData.file);

    showLoaderToast("Updating profile...");

    axios
      .post(
        `${backendUrl}/api/update-user-info`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          showSuccessToast("Profile updated successfully");
        } else {
          showErrorToast("Error updating profile");
          console.error("Error updating profile:", response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        showErrorToast("Server error");
        console.error("Error updating profile:", error);
      });
    
  };

  const [previewImage, setPreviewImage] = useState(user.image);

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Profile Information
      </h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center relative">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User className="h-full w-full p-6 text-gray-400 object-cover" />
          )}
          <label className="absolute bottom-0 right-0 p-1 bg-gray-700 rounded-full shadow-lg cursor-pointer hover:bg-gray-600 transition-colors">
            <Camera className="h-4 w-4 text-gray-300" />
            <input
              type="file"
              className="hidden"
              accept="file/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="flex-1">
          <label className="block text-gray-300 mb-2">Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-300 mb-2">User Name</label>
          <input
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-gradient-to-r from-blue-900 to-cyan-900 text-white rounded-lg hover:shadow-cyan-900/20 transition-all"
      >
        Update
      </button>
      <ToastContainer />
    </div>
  );
}
