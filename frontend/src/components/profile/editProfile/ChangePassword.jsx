import React, { useState } from "react";
import axios from "axios";
import { Shield } from "lucide-react";
import { showErrorToast, showSuccessToast, showInfoToast, showLoaderToast} from "../../toastify";
import { toast, ToastContainer } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const PasswordUpdateForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    // Basic validation
    if (newPassword !== confirmPassword) {
      showInfoToast("New passwords do not match");
      return;
    }

    showLoaderToast("Updating password...");

    try {
      const response = await axios.put(
        `${backendUrl}/api/update-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        showSuccessToast("Password updated successfully");
        setShowPasswordForm(false); // Hide the form after successful update
      } else {
        showErrorToast(response.data.message || "Failed to update password");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error updating password:", error);
      if (error.response) {
        showErrorToast(error.response.data.message || "Failed to update password");
      } else {
        showErrorToast("An error occurred while updating the password");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Security Settings</h2>
      {!showPasswordForm ? (
        <button
          onClick={() => setShowPasswordForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-900 to-cyan-900 text-white rounded-lg hover:shadow-cyan-900/20 transition-all flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Change Password
        </button>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-gray-300 mb-2">{key}</label>
              <input
                type="password"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-900 to-cyan-900 text-white rounded-lg hover:shadow-cyan-900/20 transition-all"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordForm(false)}
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
        <ToastContainer />
    </div>
  );
};

export default PasswordUpdateForm;