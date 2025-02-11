import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { showErrorToast, showLoaderToast, showSuccessToast } from "../toastify";
import HomeNavbar from "../HomeNavbar";
import DiscussionCard from "./discussionCard";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DiscussionPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const limit = 5; // Number of discussions per page

  useEffect(() => {
    fetchDiscussions();
  }, [currentPage, searchQuery]); // Fetch discussions when page or search query changes

  const fetchDiscussions = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/discussions/all`, {
        params: {
          page: currentPage,
          limit: limit,
          search: searchQuery, // Pass search query to the backend
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.status === "success") {
        setDiscussions(response.data.discussions);
        setTotalPages(response.data.totalPages); // Set total pages from the backend
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      showErrorToast("Error fetching discussions");
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();

    if (!newDiscussion.title || !newDiscussion.content) {
      return showErrorToast("Title and content are required");
    }

    if(!newDiscussion.tags) {
      newDiscussion.tags = "General";
    }

    showLoaderToast("Creating discussion...");

    try {
      const response = await axios.post(
        `${backendUrl}/api/discussions/create`,
        {
          ...newDiscussion,
          tags: newDiscussion.tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.status === "success") {
        toast.dismiss();
        setDiscussions([response.data.discussion, ...discussions]);
        setNewDiscussion({ title: "", content: "", tags: "" });
        showSuccessToast("Discussion created successfully");
        fetchDiscussions(); // Refresh the list after creating a new discussion
      }
    } catch (error) {
      showErrorToast("Error creating discussion:", error);
      toast.error("Error creating discussion");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <HomeNavbar />
      <div className="max-w-7xl mx-auto p-4">
        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="fixed bottom-6 right-6 md:hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 z-50"
        >
          <Plus size={24} />
        </button>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form Section */}
          <div
            className={`w-full md:w-1/3 ${
              showForm ? "block" : "hidden"
            } md:block transition-all duration-300`}
          >
            <div className="p-6 border border-gray-700/50 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">
                Create New Discussion
              </h2>
              <form onSubmit={handleCreateDiscussion} className="flex flex-col gap-4">
                <input
                  className="w-full p-3 border border-gray-700/50 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Title"
                  value={newDiscussion.title}
                  onChange={(e) =>
                    setNewDiscussion({ ...newDiscussion, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full p-3 border border-gray-700/50 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Content"
                  value={newDiscussion.content}
                  onChange={(e) =>
                    setNewDiscussion({ ...newDiscussion, content: e.target.value })
                  }
                  rows={4}
                />
                <input
                  className="w-full p-3 border border-gray-700/50 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Tags (comma-separated)"
                  value={newDiscussion.tags}
                  onChange={(e) =>
                    setNewDiscussion({ ...newDiscussion, tags: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Create Discussion
                </button>
              </form>
            </div>
          </div>

          {/* Discussions List Section */}
          <div className="w-full md:w-2/3">
            {/* Search Bar */}
            <div className="mb-6 flex items-center gap-2 p-3 border border-gray-700/50 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Discussions List */}
            <div className="space-y-6">
              {loading ? (
                <p className="text-center text-gray-400">Loading discussions...</p>
              ) : discussions.length > 0 ? (
                discussions.map((discussion) => (
                  <DiscussionCard
                    key={discussion._id}
                    discussion={discussion}
                    onUpdate={fetchDiscussions}
                  />
                ))
              ) : (
                <p className="text-center text-gray-400">No discussions found.</p>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 ${
                    currentPage === index + 1
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  } rounded-lg`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPage;