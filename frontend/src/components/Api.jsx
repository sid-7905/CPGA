import axios from "axios";
const backendURL = process.env.REACT_APP_BACKEND_URL;

 function getApiUrl(key, platformID) {
  if(key === "CCData") return `https://codechef-api.vercel.app/handle/${platformID}`;
  else if(key === "CFData") return `https://codeforces.com/api/user.rating?handle=${platformID}`;
  else if(key === "CFData2") return `https://codeforces.com/api/user.status?handle=${platformID}&from=1`;
  else if(key === "CFUserInfo") return `https://codeforces.com/api/user.info?handles=${platformID}&checkHistoricHandles=true`
  else if(key === "LCData") return  `https://leetcode-api.vercel.app/api/profile/${platformID}`
  else if(key === "LCContestData") return `https://leetcode-api.vercel.app/api/contest/${platformID}`
  else return "";
}

export function FetchData(key, token, id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${backendURL}/api/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          let platform = "";
          if(key === "CCData") platform = "CodeChef";
          else if(key === "CFData" || key === "CFData2" || key === "CFUserInfo") platform = "Codeforces";
          else if(key === "LCData" || key === "LCContestData") platform = "LeetCode";

          const user = response.data?.user;
           const platformID =user?.platformIds?.[0]?.[platform];

          if (platformID) {
            // console.log(`${platform}` + " ID: " + platformID); 
            const DataResponse = await axios.get(
              getApiUrl(key, platformID)
            );
            return DataResponse.data;
          } else {
            // console.log(`Platform ID for ${platform} not found`);
            return;
          }
        } catch (err) {
          console.log(err.message);
          return err.message
        }
      };

      return fetchUserData();
}

export async function fetchCCProblemCount(key, token, id) {
  try {
    const response = await axios.get(`${backendURL}/api/getcc-problem-count/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
    return response.data.totalProblemsSolved;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}


export async function getDailyProblem() {
  const user = JSON.parse(localStorage.getItem("user"));
  const problemTags = user.problemTags || ["implementation"];
  const ratingRange = user.ratingRange || { min: 800, max: 1200 };

  try {
    const allProblems = [];

    for (const tag of problemTags) {
      const response = await axios.get(`https://codeforces.com/api/problemset.problems?tags=${tag}`);
      allProblems.push(...response.data.result.problems);
    }

    const problemMap = new Map();
    allProblems.forEach(problem => {
      const key = `${problem.contestId}-${problem.index}`;
      if (!problemMap.has(key)) {
      problemMap.set(key, problem);
      }
    });

    const uniqueProblems = Array.from(problemMap.values());
    // console.log(uniqueProblems)
    const requiredProblems = uniqueProblems.filter((problem) => {
      return problem.rating >= ratingRange.min && problem.rating <= ratingRange.max;
    });
    // console.log(requiredProblems); 
    const randomProblem = requiredProblems[Math.floor(Math.random() * requiredProblems.length)];
    // console.log(randomProblem);
    localStorage.setItem("dailyProblem", JSON.stringify(randomProblem));
    try {
      await axios.post(`${backendURL}/api/save-daily-problem`, randomProblem, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Daily problem saved successfully");
    } catch (err) {
      console.log("Error saving daily problem:", err.message);
    }
    return randomProblem;
  } catch (err) {
    console.log(err.message);
  }
}


export async function getALLDailyProblems() {
  try {
    const response = await axios.get(`${backendURL}/api/get-all-daily-problems`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    return response.data;
  } catch (err) {
    console.log(err.message);
    return err;
  }
}

export async function updateProblemStatus({contestId, index, points}) {
  console.log(contestId, index, points);
  try {
    const response = await axios.post(`${backendURL}/api/update-problem-status`, {contestId, index, points}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  }
  catch (err) {
    console.log(err.message);
    return
  }
}

export async function getMainLeaderBoardData(userData) {
  try {
    const users = await Promise.all(
      userData.map(async (user) => {
        try {
          const [CCData, CFData, LCContestData] = await Promise.all([
            FetchData("CCData", localStorage.getItem("token"), user._id),
            FetchData("CFData", localStorage.getItem("token"), user._id),
            FetchData("LCContestData", localStorage.getItem("token"), user._id),
          ]);

            return {
            username: user.username,
            name: user.name,
            codeChefRating: Math.floor(CCData?.currentRating || 0),
            leetCodeRating: Math.floor(LCContestData?.userContestRanking?.rating || 0),
            codeForcesRating: Math.floor(CFData?.result?.[CFData?.result?.length - 1]?.newRating || 0),
            image: user.image,
            totalRating:
              (Math.floor(CCData?.currentRating || 0))*0.75 +
              (Math.floor(LCContestData?.userContestRanking?.rating || 0))*0.7 +
              Math.floor(CFData?.result?.[CFData?.result?.length - 1]?.newRating || 0),
            _id: user._id,
            codeForcesID : user.platformIds?.[0]?.["Codeforces"],
            codeChefID : user.platformIds?.[0]?.["CodeChef"],
            leetCodeID : user.platformIds?.[0]?.["LeetCode"],
            };
        } catch (err) {
          console.error(`Failed to fetch data for user: ${user._id}`, err);
          return null; // Return null for users whose data couldn't be fetched
        }
      })
    );

    return users.filter((user) => user !== null); // Filter out null entries
  } catch (err) {
    console.error("Failed to process leaderboard data:", err);
    throw err; // Re-throw the error to be handled by the caller
  }
}