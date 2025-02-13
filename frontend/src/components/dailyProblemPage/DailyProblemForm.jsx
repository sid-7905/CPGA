import React, { useState } from "react";
import HomeNavbar from "../HomeNavbar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DailyProblemForm = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedTags, setSelectedTags] = useState(user.problemTags);
  const [showTagAlert, setShowTagAlert] = useState(false);
  const [ratingRange, setRatingRange] = useState(user.ratingRange);

  const problemTags = [
    "array",
    "brute force",
    "implementation",
    "greedy",
    "binary search",
    "math",
    "bitmasks",
    "sortings",
    "divide and conquer",
    "dp",
    "graphs",
    "2-sat",
    "chinese remainder theorem",
    "combinatorics",
    "constructive algorithms",
    "data structures",
    "dfs and similar",
    "dsu",
    "expression parsing",
    "fft",
    "flows",
    "games",
    "geometry",
    "graph matchings",
    "hashing",
    "interactive",
    "matrices",
    "meet-in-the-middle",
    "number theory",
    "probabilities",
    "schedules",
    "shortest paths",
    "string suffix structures",
    "strings",
    "ternary search",
    "trees",
    "two pointers",
  ];



  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
      setShowTagAlert(false);
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
      setShowTagAlert(false);
    } else {
      setShowTagAlert(true);
      setTimeout(() => setShowTagAlert(false), 3000);
    }
  };

  const handleRatingChange = (type, value) => {
    const numValue = parseInt(value);
    setRatingRange((prev) => ({
      ...prev,
      [type]: numValue,
    }));
  };

  const isRatingValid = () => {
    return (
      ratingRange.min >= 800 &&
      ratingRange.max <= 3500 &&
      ratingRange.min <= ratingRange.max
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send the data to the backend
    const token = localStorage.getItem("token");

    if (!ratingRange.min || !ratingRange.max) {
      setRatingRange({ min: 800, max: 1200 });
    }

    const data = {
      problemTags: selectedTags,
      ratingRange,
    };
    // console.log(data);

    toast.promise(
      axios.post(`${backendUrl}/api/daily-problem-preferences`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      {
        pending: 'Saving preferences...',
        success: 'Preferences saved successfully!',
        error: 'An error occurred. Please try again.',
      },
      {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: '#1e293b', // Dark gray (slate) background
          color: '#00ffff',          // Cyan text
          border: '1px solid #00bcd4', // Cyan border
        }
      }
    );
    // Store the data in local storage
    localStorage.setItem("user", JSON.stringify({ ...user, problemTags: selectedTags, ratingRange }));

    // Navigate to the daily problem page
    window.location.href = "/dailyProblems";

  };

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-900 to-gray-800 w-full">
      <HomeNavbar />
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full max-w-2xl py-4">
          <div className="backdrop-blur-sm bg-opacity-20 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Daily Problem Preferences</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Tags Section */}
              <div>
                <label className="block font-medium mb-2 text-gray-200">Problem Tags</label>
                <div className="mb-2 text-gray-300">{selectedTags.length}/3 selected</div>
                {showTagAlert && (
                  <div className="text-red-400 text-sm mb-2">
                    You can select a maximum of 3 tags
                  </div>
                )}
                <div className={`overflow-hidden ${isExpanded ? "h-auto" : "h-30"}`}>
                  <div className={`flex flex-wrap gap-2 ${isExpanded ? "" : "h-20"}`}>
                    {problemTags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                          selectedTags.includes(tag)
                            ? "bg-cyan-500 text-white border-blue-600"
                            : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                        } ${
                          selectedTags.length >= 3 && !selectedTags.includes(tag)
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        } border`}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 text-cyan-400 hover:text-blue-300 text-sm"
                >
                  {isExpanded ? "Show Less" : "Show All Tags"}
                </button>
              </div>

              <hr />

              {/* Rating Range Section */}
              <div>
                <label className="block font-medium mb-2 text-gray-200">Rating Range</label>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Minimum Rating</label>
                    <input
                      type="number"
                      min={800}
                      max={3500}
                      value={ratingRange.min}
                      onChange={(e) => handleRatingChange("min", e.target.value)}
                      className="p-2 border bg-gray-700 text-white border-gray-600 rounded-lg w-28"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Maximum Rating</label>
                    <input
                      type="number"
                      min={800}
                      max={3500}
                      value={ratingRange.max}
                      onChange={(e) => handleRatingChange("max", e.target.value)}
                      className="p-2 border bg-gray-700 text-white border-gray-600 rounded-lg w-28"
                    />
                  </div>
                </div>
                {!isRatingValid() && (
                  <div className="text-red-400 text-sm mt-2">
                    Rating range must be between 800 and 3500, and minimum rating
                    must be less than or equal to maximum rating
                  </div>
                )}
              </div>

              <hr />

              {/* Selected Tags */}
              <div>
                <label className="block font-medium mb-2 text-gray-200">Selected Tags</label>
                <div className="flex gap-2 flex-wrap">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-2 bg-cyan-500 text-white rounded-lg px-3 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className="text-white hover:text-red-200"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {selectedTags.length === 0 && (
                    <span className="text-gray-400">No tags selected</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isRatingValid() && selectedTags.length > 0
                      ? "bg-blue-900 hover:bg-blue-800 text-white"
                      : "bg-gray-600 cursor-not-allowed text-gray-300"
                  }`}
                  disabled={!isRatingValid() || selectedTags.length === 0}
                >
                  Save Preferences
                </button>
                <NavLink
                  to="/dailyProblems"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-center transition-all duration-200"
                >
                  Cancel
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyProblemForm;