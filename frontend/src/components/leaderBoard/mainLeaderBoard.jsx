import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import HomeNavbar from "../HomeNavbar";
import {
  Trophy,
  Medal,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { showSuccessToast, showErrorToast, showLoaderToast } from '../toastify';
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// --- LeaderboardRow Component (Unchanged) ---
const LeaderboardRow = ({ user, index, backendUrl }) => {
  const getMedalIcon = (position) => {
    switch (position) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="text-xl font-bold text-gray-400">
            {position + 1}
          </span>
        );
    }
  };

  return (
    <div
      className={`group flex flex-wrap sm:flex-nowrap items-center w-full lg:w-2/3 rounded-xl p-4 
        ${
          index < 3
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700"
            : "bg-gray-900/60 hover:bg-gray-800/80"
        } 
        transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10`}
    >
      <div className="flex items-center gap-6 w-full sm:w-1/3 px-4">
        <div className="flex items-center justify-center w-8">
          {getMedalIcon(index)}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-full w-full p-1 text-gray-400 object-cover" />
              )}
            </div>
            {index < 3 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                {index === 0 && "�"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {user.name}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full sm:w-1/3 py-4 sm:py-0">
        <div className="px-4 py-2 bg-gray-800/50 rounded-lg">
          <span className="text-lg font-bold text-cyan-400">
            {user.dailyPoints}
          </span>
          <span className="text-gray-400 ml-2">points</span>
        </div>
      </div>

      <div className="w-full sm:w-1/3 flex justify-center">
        <NavLink to={`/profile/${user._id}`} className="w-full sm:w-auto">
          <button
            className="w-full px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg
                                     transition-colors duration-300 flex items-center justify-center gap-2"
          >
            View Profile
          </button>
        </NavLink>
      </div>
    </div>
  );
};

// --- Pagination Component (Unchanged) ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <span className="text-gray-400">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};


// --- Main Leaderboard Component (Refactored) ---
export default function Leaderboard() {
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Using more specific keys to avoid conflicts with other leaderboards
  const CACHE_KEY = "dailyLeaderboardData";
  const CACHE_TIME_KEY = "dailyLeaderboardFetchTime";

  useEffect(() => {
    const loadAndFetchLeaderboard = async () => {
      // 1. Immediately load data from localStorage if available for instant UI
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setUsers(parsedData);
          setFilteredUsers(parsedData);
        }
      } catch (error) {
        console.error("Failed to parse cached leaderboard data:", error);
        localStorage.removeItem(CACHE_KEY); // Clear corrupted data
        localStorage.removeItem(CACHE_TIME_KEY);
      }

      // 2. Decide if a fresh fetch is needed by checking the timestamp
      const fetchTime = localStorage.getItem(CACHE_TIME_KEY);
      const today = new Date().toISOString().split("T")[0];
      const lastFetchDate = fetchTime ? new Date(fetchTime).toISOString().split("T")[0] : null;

      // If data is already from today, show a success message and stop.
      if (today === lastFetchDate) {
        showSuccessToast("Leaderboard is up to date!");
        return;
      }

      // 3. If data is stale or non-existent, fetch fresh data from the API
      const toastId = showLoaderToast("Refreshing leaderboard...");
      try {
        const response = await axios.get(`${backendUrl}/api/getAllUsers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        const sortedUsers = response.data.sort(
          (a, b) => b.dailyPoints - a.dailyPoints
        );

        // Update state and local storage with the new data and timestamp
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers); // Also update filtered users
        localStorage.setItem(CACHE_KEY, JSON.stringify(sortedUsers));
        localStorage.setItem(CACHE_TIME_KEY, new Date().toISOString());

        toast.dismiss(toastId);
        showSuccessToast("Leaderboard updated successfully!");

      } catch (error) {
        console.error("Error fetching leaderboard data from backend:", error);
        toast.dismiss(toastId);
        // Inform user of failure, but they will still see the old cached data
        showErrorToast("Failed to refresh leaderboard. Showing previous data.");
      }
    };

    loadAndFetchLeaderboard();
  }, []); // This effect runs only once on mount

  // This effect handles filtering when the search query changes
  useEffect(() => {
    if (users) {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1); // Reset to first page on new search
    }
  }, [searchQuery, users]);

  const totalPages = Math.ceil((filteredUsers?.length || 0) / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers?.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const handlePageChange = (newPage) => {
    // Add boundary checks to prevent going out of page range
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div>
        <HomeNavbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-gray-400">Top performers in daily challenges</p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-2/3 mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg
                                 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400
                                 transition-colors"
            />
          </div>
        </div>

        {/* Table Header for larger screens */}
        <div className="hidden sm:flex justify-between items-center w-full md:w-2/3 mx-auto p-4 rounded-lg bg-gray-800/50 text-gray-400 text-sm font-medium mb-6">
          <div className="w-1/3 pl-20">Coders</div>
          <div className="w-1/3 text-center">POINTS</div>
          <div className="w-1/3 text-center">PROFILE</div>
        </div>
        
        {/* Conditional Rendering for Loader/Content */}
        {!currentUsers && (
             <div className="text-center text-gray-400 mt-8">
               Loading Leaderboard...
             </div>
        )}

        {currentUsers && (
          <div className="flex flex-col items-center gap-4">
            {currentUsers.map((user, index) => (
              <LeaderboardRow
                key={user._id}
                user={user}
                index={startIndex + index}
                backendUrl={backendUrl}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredUsers && filteredUsers.length > usersPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* No Results Message */}
        {filteredUsers && filteredUsers.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No players found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}