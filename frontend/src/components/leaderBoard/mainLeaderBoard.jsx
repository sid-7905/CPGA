import { Search, Trophy, Medal, Award, User } from "lucide-react";
import axios from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader } from "../loader/loader";
import { getMainLeaderBoardData } from "../Api";
import { showErrorToast } from "../toastify";
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
  const userId = JSON.parse(localStorage.getItem("user")).id;

  const fetchUsers = useCallback(async () => {
    const fetchTime = localStorage.getItem("fetchTime");
    const leaderboardData = JSON.parse(localStorage.getItem("leaderboardData"));

    if (fetchTime && leaderboardData) {
      const today = new Date().toISOString().split("T")[0];
      const lastFetchDate = new Date(fetchTime).toISOString().split("T")[0];

      if (today === lastFetchDate) {
        setUsers(leaderboardData);
        const currentUser = leaderboardData.find(user => user._id === userId);
        if (currentUser) {
          setUserData(currentUser);
        }
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${backendUrl}/api/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      const leaderboardData = await getMainLeaderBoardData(response.data);
      setUsers(leaderboardData);

      const currentUser = leaderboardData.find(user => user._id === userId);
      if (currentUser) {
        setUserData(currentUser);
      }
      localStorage.setItem("leaderboardData", JSON.stringify(leaderboardData));
      localStorage.setItem("fetchTime", new Date().toISOString());
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setError("Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (error) showErrorToast(error);

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
  };

  const processedUsers = useMemo(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      const sortValue =
        sortPlatform === "totalRating"
          ? a.codeChefRating +
            a.leetCodeRating +
            a.codeForcesRating -
            (b.codeChefRating + b.leetCodeRating + b.codeForcesRating)
          : a[sortPlatform] - b[sortPlatform];

      return sortDirection === "asc" ? sortValue : -sortValue;
    });

    const startIndex = (currentPage - 1) * usersPerPage;
    return filtered.slice(startIndex, startIndex + usersPerPage);
  }, [users, searchQuery, sortPlatform, sortDirection, currentPage]);

  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <HomeNavbar />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
        <Loader />
        </div>
      ) : (
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
            <p className="text-gray-400">Top performers in daily challenges</p>
          </div>

          <div className="w-full md:w-2/3 mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

          <div className="flex flex-col items-center gap-4">
            {processedUsers.map((user, index) => (
              <LeaderboardRow
                key={user._id}
                user={user}
                rank={(currentPage - 1) * usersPerPage + index}
                userData={userData}
              />
            ))}
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLeaderBoard;
