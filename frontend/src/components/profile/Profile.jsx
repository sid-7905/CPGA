import React from "react";
import Navbar from "../HomeNavbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import { showErrorToast, showLoaderToast, showSuccessToast } from "../toastify";
import { User } from "lucide-react";
import { toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const [userData, setUserData] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.id === id) {
      setUserData(user);
      return;
    }
    showLoaderToast("Fetching user data...");
    axios
      .get(`${backendUrl}/api/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        toast.dismiss();
        setUserData(response.data.user);
        showSuccessToast("User data fetched successfully");
      })
      .catch((error) => {
        toast.dismiss();
        showErrorToast("Error fetching user data from backend");
        console.error("Error fetching user data from backend:", error);
      });
  }, [id]);

  const platforms = [
    {
      name: "LeetCode",
      faviconUrl: "https://leetcode.com/favicon.ico",
      link: userData?.platformIds?.[0]?.LeetCode
        ? `https://leetcode.com/u/${userData.platformIds[0].LeetCode}`
        : "#",
      platformId: userData?.platformIds?.[0]?.LeetCode,
    },
    {
      name: "CodeChef",
      faviconUrl: "https://www.codechef.com/favicon.ico",
      link: userData?.platformIds?.[0]?.CodeChef
        ? `https://www.codechef.com/users/${userData.platformIds[0].CodeChef}`
        : "#",
      platformId: userData?.platformIds?.[0]?.CodeChef,
    },
    {
      name: "CodeForces",
      faviconUrl: "https://codolio.com/icons/codeforces.png",
      link: userData?.platformIds?.[0]?.Codeforces
        ? `https://codeforces.com/profile/${userData.platformIds[0].Codeforces}`
        : "#",
      platformId: userData?.platformIds?.[0]?.Codeforces,
    },
  ];

  const totalDailyProblemsSolved = userData?.dailyProblems?.filter(
    (problem) => problem.status === "solved"
  ).length;
  const totalPoints = userData?.dailyPoints;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />

      <div className="container mx-auto px-4 py-8 ">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#64ffda] shadow-lg">
                  {userData?.image? (
                    <img
                      src={userData.image}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-1 text-gray-400 object-cover" />
                  )}
                </div>
              </div>

              <div className="flex-grow space-y-4 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {userData.name}
                </h2>
                <div className="space-y-2">
                  <p className="text-cyan-300 flex items-center justify-center md:justify-start gap-2">
                    <i className="fas fa-user text-sm"></i>
                    {userData.username}
                  </p>
                  <p className="text-cyan-400 flex items-center justify-center md:justify-start gap-2">
                    <i className="fas fa-envelope text-sm"></i>
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Platforms Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Platform IDs Card */}
            <div className="bg-gray-800/50 rounded-lg shadow-xl p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-cyan-50 flex items-center gap-2">
                  <i className="fas fa-code text-cyan-400"></i>
                  Platform IDs
                </h3>
              </div>
              <div className="space-y-4">
                {platforms.map(
                  (platform) =>
                    platform.platformId && (
                      <div
                        key={platform.name}
                        className="group flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-cyan-900/20 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={platform.faviconUrl}
                            alt={platform.name}
                            className="w-6 h-6"
                          />
                          <span className="text-cyan-100">{platform.name}</span>
                        </div>
                        <a
                          href={platform.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          {platform.platformId}
                        </a>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gray-800/50 rounded-lg shadow-xl p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-cyan-50 flex items-center gap-2">
                  <i className="fas fa-trophy text-cyan-400"></i>
                  Statistics
                </h3>
              </div>
              {totalDailyProblemsSolved !== undefined &&
              totalPoints !== undefined ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-900/50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-cyan-400">
                      {totalDailyProblemsSolved}
                    </div>
                    <div className="text-sm text-cyan-200 mt-1">
                      Daily Problems Solved
                    </div>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-cyan-400">
                      {totalPoints}
                    </div>
                    <div className="text-sm text-cyan-200 mt-1">
                      Total Points
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-cyan-300">
                  No Stats Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dashboard />
    </div>
  );
};

export default Profile;