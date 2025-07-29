import { Search, Trophy, Medal, Award, User } from "lucide-react";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { Loader } from "../loader/loader";
import { getMainLeaderBoardData } from "../Api";
import { showSuccessToast, showErrorToast, showLoaderToast } from '../toastify';
import { toast } from "react-toastify";
import HomeNavbar from "../HomeNavbar";
import LeaderboardRow from "./mainLeaderBoardRow";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const MainLeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortPlatform, setSortPlatform] = useState("totalRating");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  // Use more specific keys to avoid conflicts with other leaderboards
  const CACHE_KEY = "mainLeaderboardData";
  const CACHE_TIME_KEY = "mainLeaderboardFetchTime";

  useEffect(() => {
    const loadAndFetchData = async () => {
      // 1. Immediately load data from local storage if available
      try {
        const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (cachedData && cachedData.length > 0) {
          setUsers(cachedData);
          const currentUser = cachedData.find(user => user._id === userId);
          if (currentUser) {
            setUserData(currentUser);
          }
        }
      } catch (err) {
        console.error("Failed to parse cached leaderboard data:", err);
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIME_KEY);
      }

      // 2. Decide if a fresh fetch is needed
      const fetchTime = localStorage.getItem(CACHE_TIME_KEY);
      const today = new Date().toISOString().split("T")[0];
      const lastFetchDate = fetchTime ? new Date(fetchTime).toISOString().split("T")[0] : null;

      // If data is already from today, show a success message and stop.
      if (today === lastFetchDate) {
        // showSuccessToast("Leaderboard is up to date!");
        return;
      }

      // 3. Fetch fresh data from the API
      // Only set the main page loader if there's no cached data to show
      if (!users.length) {
        setLoading(true);
      }
      
      const toastId = showLoaderToast("Refreshing leaderboard...");
      setError(null);

      try {
        const response = await axios.get(`${backendUrl}/api/getAllUsers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        const freshLeaderboardData = await getMainLeaderBoardData(response.data);
        
        // Update state and local storage with the new data
        setUsers(freshLeaderboardData);
        localStorage.setItem(CACHE_KEY, JSON.stringify(freshLeaderboardData));
        localStorage.setItem(CACHE_TIME_KEY, new Date().toISOString());

        const currentUser = freshLeaderboardData.find(user => user._id === userId);
        if (currentUser) {
          setUserData(currentUser);
        }
        
        toast.dismiss(toastId);
        showSuccessToast("Leaderboard updated successfully!");

      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Failed to fetch leaderboard");
        toast.dismiss(toastId);
        // We show a generic error toast here, but the specific one is shown below
        showErrorToast("Failed to refresh leaderboard. Showing previous data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
        loadAndFetchData();
    }
  }, [userId]);

  // This effect is for showing a single toast for a persistent error state
  useEffect(() => {
    if (error) {
        showErrorToast(error);
    }
  }, [error]);

  const sortPlatforms = [
    { key: "totalRating", label: "Total Rating" },
    { key: "codeChefRating", label: "CodeChef" },
    { key: "leetCodeRating", label: "LeetCode" },
    { key: "codeForcesRating", label: "CodeForces" },
  ];

  const toggleSort = (platform) => {
    if (sortPlatform === platform) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortPlatform(platform);
      setSortDirection("desc");
    }
    setCurrentPage(1); // Reset page on sort
  };

  const processedUsers = useMemo(() => {
    // Start with a copy of users to avoid direct mutation
    let filtered = [...users].filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      const valA = sortPlatform === "totalRating"
          ? (a.codeChefRating || 0) + (a.leetCodeRating || 0) + (a.codeForcesRating || 0)
          : (a[sortPlatform] || 0);
      
      const valB = sortPlatform === "totalRating"
          ? (b.codeChefRating || 0) + (b.leetCodeRating || 0) + (b.codeForcesRating || 0)
          : (b[sortPlatform] || 0);

      const sortValue = valA - valB;
      return sortDirection === "asc" ? sortValue : -sortValue;
    });
    
    const startIndex = (currentPage - 1) * usersPerPage;
    return filtered.slice(startIndex, startIndex + usersPerPage);
  }, [users, searchQuery, sortPlatform, sortDirection, currentPage]);

  const totalPages = useMemo(() => {
    const filteredCount = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
    return Math.ceil(filteredCount / usersPerPage);
  }, [users, searchQuery]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <HomeNavbar />
      {/* Show loader only if loading is true AND there are no users to display */}
      {loading && users.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
            <p className="text-gray-400">Top performers across all platforms</p>
          </div>

          <div className="w-full md:w-2/3 mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on new search
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-6 flex-wrap">
            {sortPlatforms.map((platform) => (
              <button
                key={platform.key}
                onClick={() => toggleSort(platform.key)}
                className={`px-4 py-2 rounded-lg transition-colors m-1 ${
                  sortPlatform === platform.key
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {platform.label}
                {sortPlatform === platform.key && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {processedUsers.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              {processedUsers.map((user, index) => {
                // Calculate global rank based on the full sorted list
                 const fullSortedList = [...users].sort((a, b) => {
                     const valA = sortPlatform === "totalRating"
                        ? (a.codeChefRating || 0) + (a.leetCodeRating || 0) + (a.codeForcesRating || 0)
                        : (a[sortPlatform] || 0);
      
                     const valB = sortPlatform === "totalRating"
                        ? (b.codeChefRating || 0) + (b.leetCodeRating || 0) + (b.codeForcesRating || 0)
                        : (b[sortPlatform] || 0);

                     const sortValue = valA - valB;
                     return sortDirection === "asc" ? sortValue : -sortValue;
                 });

                const rank = fullSortedList.findIndex(u => u._id === user._id);
                
                return (
                  <LeaderboardRow
                    key={user._id}
                    user={user}
                    rank={rank}
                    userData={userData}
                  />
                );
              })}
            </div>
           ) : (
            <div className="text-center text-gray-400 mt-8">
                {loading ? "Loading users..." : "No users found."}
            </div>
           )}

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="px-4 py-2 text-white">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainLeaderBoard;