import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { Loader } from "../loader/loader.jsx";
import useFetchWithLocalStorage from "../FetchWithLocalStorage.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ConvertCFData,
  CombineHeatMapData,
  ConvertLCData,
} from "../utils/modifyData.jsx";
import { FetchData, fetchCCProblemCount } from "../Api.jsx";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showLoaderToast,
} from "../toastify.jsx";

// Lazy load chart components
const HeatMapChart = React.lazy(() => import("./HeatMap/HeatMapChart.jsx"));
const CCRatingGraph = React.lazy(() => import("./RatingGraphs/CCRatingGraph.jsx"));
const CFRatingGraph = React.lazy(() => import("./RatingGraphs/CFRatingGraph.jsx"));
const LCRatingGraph = React.lazy(() => import("./RatingGraphs/LCRatingGraph.jsx"));
const CPStatsPieChart = React.lazy(() => import("./PieChart.jsx"));
const ShowLCBadges = React.lazy(() => import("./showLCBadges.jsx"));


const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const StatCard = ({ title, value, gradient }) => (
  <motion.div
    className={`w-full md:w-52 min-w-52 h-full text-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white 
                flex flex-col items-center justify-center gap-4 border border-gray-700/50 rounded-xl p-4 
                shadow-lg hover:shadow-cyan-900/10 transition-all duration-300 backdrop-blur-sm`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="text-gray-400 font-medium">{title}</div>
    <div className={`text-2xl font-bold ${gradient}`}>{value}</div>
  </motion.div>
);

const PlatformButton = ({ platform, handleRefresh }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center space-x-3 bg-gradient-to-r from-blue-900 to-cyan-900 text-white p-3 
               border border-cyan-800/30 rounded-xl shadow-lg hover:shadow-cyan-900/20 transition-all duration-300"
  >
    <img
      src={platform.faviconUrl}
      alt={platform.name}
      className="w-6 h-6 rounded-sm"
    />
    <a
      href={platform.link}
      target="_blank"
      rel="noreferrer"
      className="text-gray-100 hover:text-white transition-colors"
    >
      {platform.name}
    </a>
    <motion.button
      whileHover={{ rotate: 180 }}
      transition={{ duration: 0.3 }}
      onClick={() => handleRefresh(platform.name)}
      className="p-1.5 hover:bg-blue-800/50 rounded-lg transition-colors"
    >
      <i className="fas fa-solid fa-refresh text-gray-200"></i>
    </motion.button>
    <motion.a
      whileHover={{ scale: 1.1 }}
      href={platform.link}
      target="_blank"
      rel="noreferrer"
      className="fas fa-solid fa-arrow-up-right-from-square text-gray-200 p-1.5 hover:bg-blue-800/50 rounded-lg transition-colors"
    />
  </motion.div>
);

export default function Dashboard() {
  // ... [Previous state and data fetching logic remains the same]
  const [CCData, setCCData] = useState(null);
  const [CFData, setCFData] = useState(null);
  const [CFData2, setCFData2] = useState(null);
  const [CFUserInfo, setCFUserInfo] = useState(null);
  const [LCData, setLCData] = useState(null);
  const [LCContestData, setLCContestData] = useState(null);
  const [CCProblemsSolved, setCCProblemsSolved] = useState(null);
  const { id } = useParams();
  const [userHandle, setUserHandle] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserHandle(JSON.parse(user));
    }
  }, []);
  // Replace with your fetch functions
  const fetchData = FetchData;
  let specialRefresh = false;

  const fetchCCData = useFetchWithLocalStorage(
    "CCData",
    fetchData,
    setCCData,
    setError,
    specialRefresh
  );
  const fetchCCSolved = useFetchWithLocalStorage(
    "CCSolved",
    fetchCCProblemCount,
    setCCProblemsSolved,
    setError,
    specialRefresh
  );
  const fetchCFData = useFetchWithLocalStorage(
    "CFData",
    fetchData,
    setCFData,
    setError,
    specialRefresh
  );
  const fetchCFData2 = useFetchWithLocalStorage(
    "CFData2",
    fetchData,
    setCFData2,
    setError,
    specialRefresh
  );
  const fetchCFUserInfo = useFetchWithLocalStorage(
    "CFUserInfo",
    fetchData,
    setCFUserInfo,
    setError,
    specialRefresh
  );
  const fetchLCData = useFetchWithLocalStorage(
    "LCData",
    fetchData,
    setLCData,
    setError,
    specialRefresh
  );
  const fetchLCContestData = useFetchWithLocalStorage(
    "LCContestData",
    fetchData,
    setLCContestData,
    setError,
    specialRefresh
  );

  if (error) {
    console.log(error);
  }

  const platforms = [
    {
      name: "LeetCode",
      faviconUrl: "https://leetcode.com/favicon.ico",
      link: userHandle?.platformIds?.[0]?.LeetCode
        ? `https://leetcode.com/u/${userHandle.platformIds[0].LeetCode}`
        : "#",
    },
    {
      name: "CodeChef",
      faviconUrl: "https://www.codechef.com/favicon.ico",
      link: userHandle?.platformIds?.[0]?.CodeChef
        ? `https://www.codechef.com/users/${userHandle.platformIds[0].CodeChef}`
        : "#",
    },
    {
      name: "CodeForces",
      faviconUrl: "https://codolio.com/icons/codeforces.png",
      link: userHandle?.platformIds?.[0]?.Codeforces
        ? `https://codeforces.com/profile/${userHandle.platformIds[0].Codeforces}`
        : "#",
    },
  ];

  function handleRefresh(platform) {
    let fetchFunctions = [];
    if (platform === "CodeChef") {
      fetchFunctions = [fetchCCData(true), fetchCCSolved(true)];
    } else if (platform === "CodeForces") {
      fetchFunctions = [
        fetchCFData(true),
        fetchCFData2(true),
        fetchCFUserInfo(true),
      ];
    } else if (platform === "LeetCode") {
      fetchFunctions = [fetchLCData(true), fetchLCContestData(true)];
    }

    showLoaderToast("Refreshing data, please wait...");

    Promise.all(fetchFunctions)
      .then((results) => {
        const result = results[results.length - 1];
        if (result >= 0) {
          toast.dismiss(); 
          showSuccessToast("Data Refreshed Successfully");
        } else {
          toast.dismiss(); 
          showInfoToast(
            `Timeout!! Try again after ${Math.ceil(Math.abs(result))} minutes`
          );
        }
      })
      .catch((error) => {
        showErrorToast("Failed to refresh data");
      });
  }

  // For changing platform on display
  const [platform, setPlatform] = useState("CodeForces");
  const handleChange = (e) => {
    setPlatform(e.target.value);
  };

  let CFConvertedData = ConvertCFData(CFData2 ? CFData2.result : []); // For converting CFData2 to required format
  let LCConvertedData = ConvertLCData(
    LCData ? LCData.data?.matchedUser?.submissionCalendar : []
  ); // For converting LCData to required format
  const heatmapData = {
    CodeChef: CCData?.heatMap ? CCData.heatMap : [],
    CodeForces: CFConvertedData?.heatMapData ? CFConvertedData.heatMapData : [],
    LeetCode: LCConvertedData ? LCConvertedData : [],
  };

  let combinedheatMapData = [];
  try {
    combinedheatMapData = CombineHeatMapData(
      heatmapData.CodeChef,
      heatmapData.CodeForces,
      heatmapData.LeetCode
    );
  } catch (error) {
    showErrorToast("Failed to combine heatmap data");
  }

  const solvedCount = {
    CodeChef: !isNaN(CCProblemsSolved) ? CCProblemsSolved : 0,
    CodeForces:
      CFConvertedData && !isNaN(CFConvertedData.solved)
        ? parseInt(CFConvertedData.solved)
        : 0,
    LeetCode:
      LCData?.data?.matchedUser?.submitStats?.acSubmissionNum?.[0].count || 0,
  };

  const totalSolved =
    solvedCount.CodeChef + solvedCount.CodeForces + solvedCount.LeetCode;

  const contestCount = {
    CodeChef: parseInt(CCData?.ratingData ? CCData.ratingData.length : 0),
    CodeForces: parseInt(CFData?.result ? CFData.result.length : 0),
    LeetCode: parseInt(
      LCContestData?.userContestRanking?.attendedContestsCount || 0
    ),
  };

  const totalContests =
    contestCount.CodeChef + contestCount.CodeForces + contestCount.LeetCode;

  const ratingData = {
    CodeChef: {
      current: CCData ? CCData.currentRating?.toFixed(0) : 0,
      highest: CCData ? CCData.highestRating?.toFixed(0) : 0,
    },
    CodeForces: {
      current: CFUserInfo ? CFUserInfo.result?.[0]?.rating?.toFixed(0) : 0,
      highest: CFUserInfo ? CFUserInfo.result?.[0]?.maxRating?.toFixed(0) : 0,
    },
    LeetCode: {
      current: LCContestData?.userContestRanking?.rating?.toFixed(0) || 0,
      highest:
        LCContestData?.userContestRankingHistory
          ?.filter((contest) => contest.attended)
          ?.reduce((acc, contest) => Math.max(acc, contest.rating), 0)
          .toFixed(0) || 0,
    },
  };

  const rankData = {
    CodeChef: CCData ? CCData.stars : "NONE",
    CodeForces: CFUserInfo ? CFUserInfo.result?.[0]?.rank : "NONE",
    LeetCode: LCContestData?.userContestRanking?.badge?.name || "NONE",
  };

  const totalActiveDays = combinedheatMapData?.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4"
    >
      <AnimatePresence>
        {!id && (
          <motion.div {...fadeIn}>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-4">
              {platforms.map((platform) => (
                <PlatformButton
                  key={platform.name}
                  platform={platform}
                  handleRefresh={handleRefresh}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-6 main flex flex-col gap-8 items-center justify-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="w-11/12 rounded-lg flex flex-wrap items-center justify-center gap-4"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-full min-h-48 flex flex-wrap items-center justify-center gap-4">
            <div className="flex flex-col gap-4 items-center justify-center">
              <StatCard
                title="Total Problems"
                value={totalSolved}
                gradient="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
              />
              <StatCard
                title="Total Active Days"
                value={totalActiveDays}
                gradient="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
              />
            </div>
          </div>

          <motion.div
            className="w-full sm:w-auto sm:h-56 border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900 
                       rounded-xl shadow-lg backdrop-blur-sm"
            style={{ aspectRatio: "3" }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<Loader />}>
              <HeatMapChart heatMapData={combinedheatMapData} />
            </Suspense>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-11/12 rounded-lg flex flex-wrap items-center justify-center gap-4 mt-4"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="w-full sm:w-auto sm:h-72 md:h-80 border border-cyan-700/50 bg-gradient-to-br from-gray-800 to-gray-900 
                       rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm"
            style={{ aspectRatio: "2" }}
            whileHover={{ scale: 1.01 }}
          >
            <Suspense fallback={<Loader />}>
              <AnimatePresence mode="wait">
                {platform === "CodeChef" && <CCRatingGraph ratingData={CCData?.ratingData} />}
                {platform === "CodeForces" && <CFRatingGraph ratingData={CFData?.result} />}
                {platform === "LeetCode" && (
                  <LCRatingGraph userContestRankingHistory={LCContestData?.userContestRankingHistory} />
                )}
              </AnimatePresence>
            </Suspense>

          </motion.div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="w-full md:w-52 min-w-52 h-full text-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col items-center justify-center gap-4 border border-gray-700/50 rounded-xl p-4 shadow-lg hover:shadow-cyan-900/10 transition-all duration-300 backdrop-blur-sm">
              <span className="text-gray-400 font-medium">Total Contests</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {totalContests}
              </span>
            </div>

            <div
              className="h-48 md:h-52 border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex flex-col gap-4 items-center text-white justify-center p-6  shadow-lg hover:shadow-cyan-900/10 transition-all duration-300 backdrop-blur-sm"
              style={{ aspectRatio: "1" }}
            >
              <select
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                onChange={handleChange}
              >
                <option value="CodeForces">CodeForces</option>
                <option value="LeetCode">LeetCode</option>
                <option value="CodeChef">CodeChef</option>
              </select>

              
              <div className="text-center flex flex-col gap-2 items-start">
                <div className="text-gray-300">
                Contests: {contestCount[platform]}
              </div>

                <div className="text-gray-300 mb-2">
                  Rating: {ratingData[platform].current}
                  <span className="text-gray-400 text-sm ml-2">
                    ({ratingData[platform].highest || "none"})
                  </span>
                </div>
                <div className="text-gray-300">Rank: {rankData[platform]}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="w-full sm:w-7/12 flex flex-wrap items-center justify-center gap-4"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
            <div className="border border-gray-700/50 w-64 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <Suspense fallback={<Loader />}>
                  <CPStatsPieChart Count={solvedCount} Title={"Problems Solved"} />
                </Suspense>
            </div>

            <div className="border border-gray-700/50 w-64 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <CPStatsPieChart
                Count={contestCount}
                Title={"Contests Attended"}
              />
            </div>

            <div className="border border-gray-700/50 w-full sm:w-64 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col justify-center items-center gap-4 shadow-lg overflow-hidden">
              <h1 className="text-lg font-semibold text-gray-200">Progress</h1>
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="group flex items-center justify-between w-full sm:w-52 gap-2 space-x-3 bg-gradient-to-r from-blue-900 to-cyan-900 text-white p-2 border border-cyan-800/30 rounded-lg hover:scale-110  transition-all duration-300"
                >
                  <div className="w-1/3">
                  <img
                    src={platform.faviconUrl}
                    alt={platform.name}
                    className="w-6 h-6 group-hover:rotate-12 "
                    />
                    </div>
                  <div className="w-1/3 font-medium">
                    {ratingData[platform.name].current}
                  </div>
                  <div className="w-1/3 text-gray-200">{rankData[platform.name]}</div>
                </div>
              ))}
          </div>
        </motion.div>

        <motion.div
          className="border w-full sm:w-7/12 border-gray-700/50 rounded-xl bg-gradient-to-br flex items-center justify-center from-gray-900 to-gray-950 shadow-lg"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Suspense fallback={<Loader />}>
            <ShowLCBadges badges={LCData?.data?.matchedUser?.badges} />
          </Suspense>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
