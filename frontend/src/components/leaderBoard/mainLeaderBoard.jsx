import { Search, Trophy, Medal, Award, User } from "lucide-react";
import axios from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader } from "../loader/loader";
import { getMainLeaderBoardData } from "../Api";
import { showErrorToast } from "../toastify";
import HomeNavbar from "../HomeNavbar";
import { NavLink } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const getProfileLink = (platformId, platform) => {
  if (!platformId) return "#";
  const platformUrls = {
    CodeChef: `https://www.codechef.com/users/${platformId}`,
    LeetCode: `https://leetcode.com/${platformId}`,
    CodeForces: `https://codeforces.com/profile/${platformId}`,
  };

  return platformUrls?.[platform] || "#";
};

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
        <span className="text-xl font-bold text-gray-400">{position + 1}</span>
      );
  }
};

// Reusable Leaderboard Row Component
const LeaderboardRow = ({ user, rank }) => (
  <div
    key={user._id}
    className={`group flex flex-wrap md:flex-nowrap items-center w-full lg:w-4/5 rounded-xl p-4 
            ${
              rank < 3
                ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700"
                : "bg-gray-900/60 hover:bg-gray-800/80"
            } 
            transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10`}
  >
    <div className="flex items-center gap-6 w-full sm:w-1/3 px-4">
      <div className="flex items-center justify-center w-8">
        {getMedalIcon(rank)}
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
        {user?.image ? (
          <img
            src={`${backendUrl}/images/uploads/${user.image}`}
            alt="Profile"
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <User className="h-full w-full p-1 text-gray-400 object-cover" />
        )}
      </div>
      <NavLink to={`/profile/${user._id}`}>
        <p className="text-white font-semibold hover:text-blue-500">
          {user.name}
        </p>
        <p className="text-gray-400 text-sm hover:text-blue-500">
          @{user.username}
        </p>
      </NavLink>
    </div>

    <div className="flex items-center justify-evenly w-full sm:w-1/3 py-4 sm:py-0">
      {[
        { key: "codeChefRating", platformID: "codeChefID", label: "CodeChef" },
        { key: "leetCodeRating", platformID: "leetCodeID", label: "LeetCode" },
        {
          key: "codeForcesRating",
          platformID: "codeForcesID",
          label: "CodeForces",
        },
      ].map((platform) => (
        <div key={platform.key} className="text-center">
          <NavLink
            to={getProfileLink(user[platform.platformID], platform.label)}
            target="_blank"
            className={`font-semibold ${
              user[platform.key] === 0
                ? "text-gray-500"
                : "text-white hover:text-blue-500 "
            }`}
          >
            {user[platform.key] || "N/A"}
          </NavLink>
          <p className="text-gray-400 text-xs">{platform.label}</p>
        </div>
      ))}
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

const MainLeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortPlatform, setSortPlatform] = useState("totalRating");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    const fetchTime = localStorage.getItem("fetchTime");
    const leaderboardData = localStorage.getItem("leaderboardData");

    if (fetchTime && leaderboardData) {
      const today = new Date().toISOString().split("T")[0];
      const lastFetchDate = new Date(fetchTime).toISOString().split("T")[0];

      if (today === lastFetchDate) {
        setUsers(JSON.parse(leaderboardData));
        console.log(JSON.parse(leaderboardData));
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
