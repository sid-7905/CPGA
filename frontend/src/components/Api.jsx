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
            console.log(`${platform}` + " ID: " + platformID); 
            const DataResponse = await axios.get(
              getApiUrl(key, platformID)
            );
            return DataResponse.data;
          } else {
            console.log(`Platform ID for ${platform} not found`);
            return;
          }
        } catch (err) {
          console.log(err.message);
          return err.message
        }
      };

      return fetchUserData();
}

export async function fetchCodeChefData(key ,token, id) {
  try {
    const response = await axios.get(`${backendURL}/api/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response.data?.user;
    const userHandle =user?.platformIds?.[0]?.["CodeChef"];
    const ccresponse = await axios.post(`${backendURL}/api/getcc-problem-count`, { userHandle }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return ccresponse.data.totalProblemsSolved;
  } catch (err) {
    console.log(err?.message);
  }
};


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
