import React from "react";
import { useState, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "../../toastify";
import axios from "axios";
import { ToastContainer } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function EditContactDetails() {
  // const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo) {
      setFormData({
        email: userInfo.email,
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formdata = {
      email: formData.email,
    }
    axios
      .post(
        `${backendUrl}/api/update-email`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          showSuccessToast("Email updated successfully");
        } else {
          showErrorToast("Error updating email");
          console.error("Error updating email:", response.data.message);
        }
      })
      .catch((error) => {
        showErrorToast("Server error");
        console.error("Error updating email:", error);
      });
    
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Contact Details
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Email Address</label>
          <div className="flex gap-2">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {/* {!isEmailVerified && (
              <button
                onClick={() => setIsEmailVerified(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-900 to-cyan-900 text-white rounded-lg hover:shadow-cyan-900/20 transition-all"
              >
                Verify Email
              </button>
            )} */}
          </div>
          {/* {isEmailVerified && (
            <div className="mt-2 p-3 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-cyan-800/30 rounded-xl">
              <div className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-cyan-400" />
                <span className="text-white">Email Verified</span>
              </div>
            </div>
          )} */}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-blue-900 to-cyan-900 text-white rounded-lg hover:shadow-cyan-900/20 transition-all"
        >
          Update Email
        </button>
      </div>
      <ToastContainer/>
    </div>
  );
}
