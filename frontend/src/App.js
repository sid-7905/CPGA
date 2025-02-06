import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./components/landingpages/landing.jsx";
import Login from "./components/profile/Login.jsx";
import Signup from "./components/profile/Signup.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import Home from "./components/Home.jsx";
import About from "./components/landingpages/about.jsx";
import Profile from "./components/profile/Profile.jsx";
import Idform from "./components/profile/Idform.jsx";
import LeaderBoard from "./components/leaderBoard/dailyLeaderBoard.jsx";
import DailyProblems from "./components/dailyProblemPage/DailyProblems.jsx";
import "react-toastify/dist/ReactToastify.css";
import DailyProblemForm from "./components/dailyProblemPage/DailyProblemForm.jsx";
import EditProfile from "./components/profile/editProfile/EditProfile.jsx";
import Discussion from "./components/discussionPage/discussion.jsx";
import MainLeaderBoard from "./components/leaderBoard/mainLeaderBoard.jsx";
import ErrorPage from "./components/errorPage.jsx"

function checkLogin() {
  const token = localStorage.getItem("token");
  return token ? true : false;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: checkLogin() ? <Home /> : <Landing />,
    },
    {
      path: "/login",
      element: checkLogin() ? <Home /> : <Login />,
    },
    {
      path: "/register",
      element: checkLogin() ? <Home /> : <Signup />,
    },
    {
      path: "/about",
      element: checkLogin() ? <About /> : <Login />,
    },
    {
      path: "/discussion",
      element: checkLogin() ? <Discussion /> : <Login />,
    },
    {
      path: "/profile/:id",
      element: checkLogin() ? <Profile /> : <Login />,
    },
    {
      path: "/getIds",
      element: checkLogin() ? <Idform /> : <Login />,
    },
    {
      path: "/leaderBoard",
      element: checkLogin() ? <LeaderBoard /> : <Login />,
    },
    {
      path: "/dailyproblems",
      element: checkLogin() ? <DailyProblems /> : <Login />,
    },
    {
      path: "/daily-problem-form",
      element: checkLogin() ? <DailyProblemForm /> : <Login />,
    },
    {
      path: "/edit-profile",
      element: checkLogin() ? <EditProfile /> : <Login />,
    },
    {
      path: "/discussion",
      element: checkLogin() ? <Discussion /> : <Login />,
    },
    {
      path: "/mainLeaderBoard",
      element: <MainLeaderBoard />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return (
    <div className="h-fit">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
