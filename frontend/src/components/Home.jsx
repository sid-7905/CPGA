import React from "react";
import Dashboard from "./dashboard/Dashboard";
import HomeNavbar from "./HomeNavbar";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 h-full">
      <>
        <HomeNavbar />
      </>
      <>
        <Dashboard />
      </>
    </div>
  );
}
