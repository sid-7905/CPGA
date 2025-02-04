import React from "react";
import { NavLink } from "react-router-dom";
import useFetchWithLocalStorage from "../FetchWithLocalStorage.jsx";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showLoaderToast, showSuccessToast, showInfoToast } from "../toastify.jsx";
import {updateProblemStatus, FetchData} from "../Api";
import Countdown from "./timer.jsx";

export default function DailyProblemCard({problem, ind}) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const [data, setData] = useState({});
  const [isSolved, setIsSolved] = useState(problem.status==="solved");

  const fetchCfSolvedProblem = useFetchWithLocalStorage(
    "CFData2",
    FetchData,
    setData
  );
  
  // console.log("rerendering component" + ind);
  function handleRefresh(){

    if(isSolved) {
      showInfoToast("Problem already solved");
      return;
    }
    const fetchFunctions = [];
    fetchFunctions.push(fetchCfSolvedProblem(true, 0));
    showLoaderToast("Refreshing data, please wait...");

    Promise.all(fetchFunctions)
      .then((results) => {
        const result = results[results.length - 1];
        if (result >= 0) {
          const problemSolved = data.result;
          toast.dismiss(); // Dismiss the info toast

          const url = new URL(problem.link);
          const pathSegments = url.pathname.split('/');
          const contestId = pathSegments[2];
          const index = pathSegments[4];
          let points = problem.points? problem.points: 500;
          const currentDate = new Date();
          const problemDate = new Date(problem.date);
          const dailyFetchTime = new Date();
          dailyFetchTime.setHours(0, 0, 0, 0);

          if (!(problemDate > dailyFetchTime && problemDate <= currentDate)) {
            points = 0;
          }
            const solvedProblem = problemSolved.find(p => p.problem.contestId == contestId && p.problem.index === index && p.verdict === "OK");
            if (solvedProblem) {
            const previousLocalStorageData = JSON.parse(localStorage.getItem("dailyProblem"));
            previousLocalStorageData[ind].status = "solved";
            localStorage.setItem("dailyProblem", JSON.stringify(previousLocalStorageData));
            const fetchTime = new Date().toISOString();
            localStorage.setItem("fetchTimeOfDailyProblem", fetchTime);
            
            updateProblemStatus({contestId, index, points});
            setIsSolved(true);
            problem.status = "solved";
            showSuccessToast("Yay! Problem solved successfully");   
          }
          else {
            showInfoToast("Problem not solved yet");
          }
        } else {
          toast.dismiss(); // Dismiss the info toast
          showInfoToast(
            `Timeout!! Try again after ${Math.ceil(Math.abs(result))} minutes`
          );
        }
      })
      .catch((error) => {
        toast.error("Failed to refresh data");
      });
    }
    
    const isDailyProblem = formatDate(problem.date) === formatDate(Date.now());

    const getDifficultyColor = (rating) => {
      if (rating < 1200) return 'text-green-400';
      if (rating < 1800) return 'text-yellow-400';
      return 'text-red-400';
    };

  return (
    <div
    className={`w-full transition-all duration-300 hover:scale-[1.01] ${
      problem.status === "solved"
        ? "bg-cyan-900/40 border border-cyan-700/50" 
        : "bg-gray-900/90 border border-gray-700/50"
    } ${
      isDailyProblem 
        ? "ring-2 ring-cyan-400 ring-opacity-50 shadow-lg shadow-cyan-500/20" 
        : ""
    } rounded-xl backdrop-blur-sm p-6`}
  >
    <div className="flex flex-col md:flex-row w-full gap-6 items-start md:items-center">
      <div className="flex-grow space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
          >
            <i className="fas fa-refresh text-gray-400 hover:text-white transition-colors" />
          </button>
          <span className="text-sm text-gray-400">{formatDate(problem.date)}</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {problem.name}
          </h3>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Difficulty:</span>
              <span className={getDifficultyColor(problem.rating)}>
                {problem.rating}
              </span>
            </div>
            
            {isDailyProblem && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Points:</span>
                <span className="text-white">
                  {problem.points || "500"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 self-stretch md:self-center">
        <NavLink 
          to={problem.link} 
          target="_blank"
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-lg transition-colors"
        >
          {problem.status==="solved"? "View Problem": "Solve Problem"}
        </NavLink>
        
        {isDailyProblem && problem.status==="pending" &&(
          <div className="flex-shrink-0">
            <Countdown />
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
