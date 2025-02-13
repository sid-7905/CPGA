import React, { useState, useEffect } from "react";
import Navbar from "../HomeNavbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import { showErrorToast, showLoaderToast, showSuccessToast } from "../toastify";
import { User } from "lucide-react";
import { toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.id === id) {
      setUserData(user);
      setIsLoaded(true);
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
        setIsLoaded(true);
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

  const StatCard = ({ value, label, icon }) => (
    <div className="p-6 bg-gray-900/50 rounded-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
      <div className="text-4xl font-bold text-cyan-400 animate-number">
        {value}
      </div>
      <div className="text-sm text-cyan-200 mt-2 flex items-center justify-center gap-2">
        <i className={`fas ${icon} text-cyan-400`}></i>
        {label}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8 opacity-0 animate-fadeIn">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-xl p-8 transform hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 animate-profileImageLoad">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-cyan-400/30 shadow-lg hover:border-cyan-400 transition-all duration-300">
                  {userData?.image ? (
                    <img
                      src={userData.image}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover transform hover:scale-110 transition-all duration-500"
                    />
                  ) : (
                    <User className="h-full w-full p-2 text-gray-400 object-cover" />
                  )}
                </div>
              </div>

              <div className="flex-grow space-y-4 text-center md:text-left animate-slideInRight">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
                  {userData.name}
                </h2>
                <div className="space-y-3">
                  <p className="text-cyan-300 flex items-center justify-center md:justify-start gap-3 hover:text-cyan-200 transition-colors">
                    <i className="fas fa-user text-lg"></i>
                    {userData.username}
                  </p>
                  <p className="text-cyan-400 flex items-center justify-center md:justify-start gap-3 hover:text-cyan-300 transition-colors">
                    <i className="fas fa-envelope text-lg"></i>
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Platforms Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Platform IDs Card */}
            <div className="bg-gray-800/50 rounded-lg shadow-xl p-8 transform hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 flex items-center gap-3">
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
                        className="group flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-cyan-900/20 transition-all duration-300 transform hover:scale-102 hover:shadow-lg"
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <img
                            src={platform.faviconUrl}
                            alt={platform.name}
                            className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300"
                          />
                          <span className="text-cyan-100 font-medium">{platform.name}</span>
                        </div>
                        <a
                          href={platform.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium hover:underline"
                        >
                          {platform.platformId}
                        </a>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gray-800/50 rounded-lg shadow-xl p-8 transform hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 flex items-center gap-3">
                  <i className="fas fa-trophy text-cyan-400"></i>
                  Statistics
                </h3>
              </div>
              {totalDailyProblemsSolved !== undefined && totalPoints !== undefined ? (
                <div className="grid grid-cols-2 gap-6">
                  <StatCard
                    value={totalDailyProblemsSolved}
                    label="Daily Problems Solved"
                    icon="fa-check-circle"
                  />
                  <StatCard
                    value={totalPoints}
                    label="Total Points"
                    icon="fa-star"
                  />
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
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes profileImageLoad {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animate-profileImageLoad {
          animation: profileImageLoad 0.8s ease-out forwards;
        }
        .animate-number {
          transition: all 0.3s ease-out;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
      <Dashboard />
    </div>
  );
};

export default Profile;