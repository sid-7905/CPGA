import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../toastify";
import { Activity } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const IdForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const platforms = {
    Codeforces: {
      description: "Daily Problems & Profile Stats",
      faviconUrl: "https://codolio.com/icons/codeforces.png",
    },
    CodeChef: {
      description: "Profile Stats",
      faviconUrl: "https://www.codechef.com/favicon.ico",
    },
    LeetCode: {
      description: "Profile Stats",
      faviconUrl: "https://leetcode.com/favicon.ico",
    },
  };

  const [ids, setIds] = useState({
    Codeforces: user?.platformIds?.[0]?.Codeforces || "",
    CodeChef: user?.platformIds?.[0]?.CodeChef || "",
    LeetCode: user?.platformIds?.[0]?.LeetCode || "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIds({ ...ids, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userid = user.id;
    if (!ids.CodeChef && !ids.Codeforces && !ids.LeetCode) {
      showErrorToast("Please provide at least one Platform ID");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/${userid}/addPlatforms`,
        ids,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          platformIds: [{ ...ids }],
        })
      );
      showSuccessToast("Platforms added successfully");
      window.location = "/";
    } catch (err) {
      showErrorToast(err.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center" >
      <div className="py-2 w-full lg:w-1/2 min-h-screen">
        <div className="flex items-center justify-center mb-8">
          <Activity className="h-8 w-8 text-cyan-500 mr-2" />
          <h2 className="text-2xl font-bold text-white">
            Connect Your Platforms
          </h2>
        </div>

        <p className="text-gray-400 text-sm text-center mb-8">
          Link your coding profiles to track your progress across platforms
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(platforms).map(
            ([platform, { description, faviconUrl }]) => (
              <div
                key={platform}
                className="group bg-gray-900 rounded-lg p-4 transition-all duration-200"
              >
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={faviconUrl}
                      alt={`${platform} icon`}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-sm font-medium text-gray-300">
                      {platform}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{description}</p>
                  <input
                    type="text"
                    name={platform}
                    value={ids[platform]}
                    onChange={handleChange}
                    placeholder={`Enter your ${platform} username`}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 
                        shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 
                        focus:ring-opacity-50 text-white placeholder-gray-400
                        transition-all duration-200 p-2"
                  />
                </label>
              </div>
            )
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent 
                  rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 
                  hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-cyan-500 transition-colors duration-200 disabled:opacity-50
                  disabled:cursor-not-allowed"
            onClick = {handleSubmit}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center">Processing...</span>
            ) : (
              "Connect Platforms"
            )}
            
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default IdForm;
