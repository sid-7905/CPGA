import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeatMapChart from "./HeatMap/HeatMapChart.jsx";
import CCRatingGraph from "./RatingGraphs/CCRatingGraph.jsx";
import CFRatingGraph from "./RatingGraphs/CFRatingGraph.jsx";
import LCRatingGraph from "./RatingGraphs/LCRatingGraph.jsx";
import CPStatsPieChart from "./PieChart.jsx";
import ShowLCBadges from "./showLCBadges.jsx";
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

export default function Dashboard() {
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
      fetchFunctions = [
        fetchCCData(true),
         fetchCCSolved(true)
        ];
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
          toast.dismiss(); // Dismiss the info toast
          showSuccessToast("Data Refreshed Successfully");
        } else {
          toast.dismiss(); // Dismiss the info toast
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
  const [platform, setPlatform] = useState("CodeChef");
  const handleChange = (e) => {
    setPlatform(e.target.value);
  };

  const allDataFetched =
    CCData &&
    CFData &&
    CFData2 &&
    LCData &&
    CFUserInfo &&
    LCContestData &&
    CCProblemsSolved &&
    userHandle;

  // const [timeoutReached, setTimeoutReached] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setTimeoutReached(true);
  //   }, 5000); // 30 seconds

  //   return () => clearTimeout(timer);
  // }, []);

  if (!allDataFetched) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader />
        <div className="text-lg text-white">Loading data, please wait...</div>
      </div>
    );
  }

  let CFConvertedData = ConvertCFData(CFData2 ? CFData2.result : []); // For converting CFData2 to required format
  let LCConvertedData = ConvertLCData(LCData ? LCData.data?.matchedUser?.submissionCalendar : []); // For converting LCData to required format
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
    CodeForces: (CFConvertedData && !isNaN(CFConvertedData.solved)) ? parseInt(CFConvertedData.solved) : 0,
    LeetCode: LCData?.data?.matchedUser?.submitStats?.acSubmissionNum?.[0].count || 0,
  };

  const totalSolved =
    solvedCount.CodeChef + solvedCount.CodeForces + solvedCount.LeetCode;

  const contestCount = {
    CodeChef: parseInt(CCData?.ratingData ? CCData.ratingData.length : 0),
    CodeForces: parseInt(CFData?.result ? CFData.result.length : 0),
    LeetCode: parseInt(
      LCContestData?.userContestRanking?.attendedContestsCount  || 0
    ),
  };

  const totalContests =
    contestCount.CodeChef+ contestCount.CodeForces + contestCount.LeetCode ;

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
      highest: LCContestData?.userContestRankingHistory
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Refresh and platform link buttons */}
      {!id && (
        <div>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-4">
            {platforms.map((platform) => (
              <div
                className="flex items-center space-x-3 !bg-gradient-to-r !from-blue-900 !to-cyan-900 text-white p-3 border border-cyan-800/30 rounded-xl shadow-lg hover:shadow-cyan-900/20 transition-all duration-300"
                key={platform.name}
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
                <button
                  onClick={() => handleRefresh(platform.name)}
                  className="p-1.5 hover:bg-blue-800/50 rounded-lg transition-colors"
                >
                  <i className="fas fa-solid fa-refresh text-gray-200"></i>
                </button>
                <a
                  href={platform.link}
                  target="_blank"
                  rel="noreferrer"
                  className="fas fa-solid fa-arrow-up-right-from-square text-gray-200 p-1.5 hover:bg-blue-800/50 rounded-lg transition-colors"
                ></a>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Main content */}
      <div className="mt-6 main flex flex-col gap-8 items-center justify-center">
        {/* Heat Map */}
        <div className="w-11/12 rounded-lg flex flex-wrap items-center justify-center gap-4">
          <div className="h-full min-h-48 flex flex-wrap items-center justify-center gap-4">
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="w-full md:w-52 min-w-52 h-full text-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col items-center justify-center gap-4 border border-gray-700/50 rounded-xl p-4 shadow-lg hover:shadow-cyan-900/10 transition-all duration-300">
                <div className="text-gray-400 font-medium">Total Problems</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {totalSolved}
                </div>
              </div>
              <div className="w-full md:w-52 min-w-52 h-full text-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col items-center justify-center gap-4 border border-gray-700/50 rounded-xl p-4 shadow-lg hover:shadow-cyan-900/10 transition-all duration-300">
                <div className="text-gray-400 font-medium">
                  Total Active Days
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {totalActiveDays}
                </div>
              </div>
            </div>
          </div>

          <div
            className="h-36 sm:h-56 border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg"
            style={{ aspectRatio: "3" }}
          >
            <HeatMapChart heatMapData={combinedheatMapData} />
          </div>
        </div>

        {/* Rating Graph and Stats */}
        <div className="w-11/12 rounded-lg flex flex-wrap items-center justify-center gap-20 md:gap-4 mt-20 md:mt-4">
          <div
            className="h-48 sm:h-72 md:h-80 border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg"
            style={{ aspectRatio: "2" }}
          >
            {platform === "CodeChef" && (
              <CCRatingGraph ratingData={CCData?.ratingData} />
            )}
            {platform === "CodeForces" && (
              <CFRatingGraph ratingData={CFData?.result} />
            )}
            {platform === "LeetCode" && (
              <LCRatingGraph
              userContestRankingHistory={LCContestData?.userContestRankingHistory}
              />
            )}
          </div>

          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="w-full md:w-52 min-w-52 h-full text-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col items-center justify-center gap-4 border border-gray-700/50 rounded-xl p-4 shadow-lg">
              <span className="text-gray-400 font-medium">Total Contests</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {totalContests}
              </span>
            </div>

            <div
              className="h-48 md:h-52 border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex flex-col gap-4 items-center text-white justify-center p-6 shadow-lg"
              style={{ aspectRatio: "1" }}
            >
              <select
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                onChange={handleChange}
              >
                <option value="CodeChef">CodeChef</option>
                <option value="CodeForces">CodeForces</option>
                <option value="LeetCode">LeetCode</option>
              </select>

              <div className="text-gray-300">
                Contests: {contestCount[platform]}
              </div>

              <div className="text-center">
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
        </div>

        {/* Stats Pie Charts */}
        <div className="w-7/12 flex flex-wrap items-center justify-center gap-4">
          <div className="border border-gray-700/50 w-64 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
            <CPStatsPieChart Count={solvedCount} Title={"Problems Solved"} />
          </div>

          <div className="border border-gray-700/50 w-64 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
            <CPStatsPieChart Count={contestCount} Title={"Contests Attended"} />
          </div>

          <div className="border border-gray-700/50 w-64 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col justify-center items-center gap-4 shadow-lg">
            <h1 className="text-lg font-semibold text-gray-200">Progress</h1>
            {platforms.map((platform) => (
              <div
                className="flex items-center justify-between w-full space-x-3 bg-gradient-to-r from-blue-900 to-cyan-900 text-white p-3 border border-cyan-800/30 rounded-lg hover:shadow-lg transition-all duration-300"
                key={platform.name}
              >
                <img
                  src={platform.faviconUrl}
                  alt={platform.name}
                  className="w-6 h-6"
                />
                <div className="font-medium">
                  {ratingData[platform.name].current}
                </div>
                <div className="text-gray-200">{rankData[platform.name]}</div>
              </div>
            ))}
          </div>
        </div>
        <div  className="border border-gray-700/50 rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg">
          <ShowLCBadges badges = {LCData?.data?.matchedUser?.badges} />
        </div>
      </div>
    </div>
  );
}
