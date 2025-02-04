import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeNavbar from "../HomeNavbar";
import DailyProblemCard from "./DailyProblemCard";
import { getDailyProblem, getALLDailyProblems } from "../Api";
import { showErrorToast, showInfoToast, showSuccessToast } from "../toastify";
import Calendar from "./Calendar";
import SortControls from "./SortControls";
import SearchBar from "./SearchBar";
import FilterStats from "./FilterStats";
import ProblemPreference from "./ProblemPreference";

export default function DailyProblems() {
  
  const user = JSON.parse(localStorage.getItem("user"));
  const problemTags = user?.problemTags;
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [searchQuery, setSearchQuery] = useState("");
  const problemRefs = useRef({});

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProblems(problems);
      return;
    }

    const filtered = problems.filter((problem) =>
      problem.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProblems(filtered);
  };

  const scrollToProblem = (date) => {
    const targetDate = date.toISOString().split("T")[0];
    const element = problemRefs.current[targetDate];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const shouldFetchDailyProblem = async (problems) => {
    const dailyFetchTime = new Date();
    dailyFetchTime.setHours(0, 0, 0, 0);

    if (problems?.length > 0) {
      const firstProblemTime = new Date(problems[0].date);
      if (firstProblemTime.getTime() < dailyFetchTime.getTime()) {
        await fetchDailyProblem();
      }
    } else {
      console.log("No problems found. Fetching new daily problems...");
      await fetchDailyProblem();
    }
  };

  const [sortType, setSortType] = useState("date-new");

  const handleSort = (type) => {
    setSortType(type);
    let sortedProblems = [
      ...(filteredProblems.length > 0 ? filteredProblems : problems),
    ];

    switch (type) {
      case "date-new":
        sortedProblems.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "date-old":
        sortedProblems.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "difficulty-high":
        sortedProblems.sort((a, b) => b.rating - a.rating);
        break;
      case "difficulty-low":
        sortedProblems.sort((a, b) => a.rating - b.rating);
        break;
      case "solved":
        sortedProblems.sort((a, b) => {
          if (a.status === "solved" && b.status !== "solved") return -1;
          if (a.status !== "solved" && b.status === "solved") return 1;
          return new Date(b.date) - new Date(a.date); // Secondary sort by date
        });
        break;
      case "unsolved":
        sortedProblems.sort((a, b) => {
          // Prioritize unsolved problems
          const aUnsolved = a.status !== "solved";
          const bUnsolved = b.status !== "solved";

          if (aUnsolved && !bUnsolved) return -1; // a is unsolved, b is solved
          if (!aUnsolved && bUnsolved) return 1; // a is solved, b is unsolved

          // If both are solved or both are unsolved, sort by date
          return new Date(b.date) - new Date(a.date);
        });
        break;
      default:
        break;
    }

    setFilteredProblems(sortedProblems);
  };

  useEffect(() => {
    const fetchAllDailyProblems = async () => {
      const storedProblems = JSON.parse(localStorage.getItem("dailyProblem"));

      if (storedProblems && storedProblems.length > 0) {
        setProblems(storedProblems);
        await shouldFetchDailyProblem(storedProblems);
        return;
      }

      try {
        const response = await getALLDailyProblems();
        if (!response || response.length === 0) {
          console.warn("No daily problems available.");
          showInfoToast("No daily problems available!");
          await shouldFetchDailyProblem(response);
          return;
        }

        setProblems(response);
        localStorage.setItem("dailyProblem", JSON.stringify(response));
        localStorage.setItem(
          "fetchTimeOfDailyProblem",
          new Date().toISOString()
        );

        await shouldFetchDailyProblem(response);
        showSuccessToast("All Daily problems fetched successfully!");
      } catch (error) {
        console.error("Error fetching all daily problems:", error);
        showErrorToast("Error fetching all daily problems.");
      }
    };

    fetchAllDailyProblems();
  }, []);

  const fetchDailyProblem = async () => {
    try {
      await toast.promise(
        getDailyProblem(),
        {
          pending: "Fetching daily problem...",
          success: "Daily problem fetched successfully!",
          error: "Error fetching daily problem. Please try again.",
        },
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            backgroundColor: '#1e293b', // Dark gray (slate) background
            color: '#00ffff',          // Cyan text
            border: '1px solid #00bcd4', // Cyan border
          }
        }
      );

      const response = await getALLDailyProblems();
      setProblems(response);
      localStorage.setItem("dailyProblem", JSON.stringify(response));
      localStorage.setItem("fetchTimeOfDailyProblem", new Date().toISOString());
    } catch (error) {
      showErrorToast("Error fetching daily problem. Please try again.");
      console.error("Error fetching daily problem:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col  bg-gradient-to-b from-gray-900 to-gray-800 w-full">
      <HomeNavbar />

      <div className=" w-full h-full flex flex-col items-center">
        <div className="min-h-72 w-full flex items-center justify-center ">
          <div className="flex backdrop-blur-sm flex-col gap-4 mb-8 w-11/12">
            <ProblemPreference problemTags={problemTags} />
            <SortControls onSort={handleSort} currentSort={sortType} />
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full justify-evenly">
          <div className="w-96 lg:w-1/3 h-96">
            <div className="lg:fixed">
              <Calendar problems={problems} onDayClick={scrollToProblem} />
              <FilterStats
                problems={problems}
                filteredCount={
                  (filteredProblems.length > 0 ? filteredProblems : problems)
                    .length
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full lg:w-1/2">
            <div className="space-y-4">
              {(filteredProblems.length > 0 ? filteredProblems : problems)?.map(
                (problem, index) => (
                  <div
                    key={problem.id || index}
                    ref={(el) =>(problemRefs.current[problem.date.split("T")[0]] = el)}
                    className="w-full"
                  >
                    <DailyProblemCard problem={problem} ind={index} />
                  </div>
                )
              )}
              {(filteredProblems.length > 0 ? filteredProblems : problems)
                .length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No problems found matching your criteria
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
