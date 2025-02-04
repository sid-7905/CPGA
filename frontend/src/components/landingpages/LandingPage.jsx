import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, Code, Target, Users } from "lucide-react";
import Image from "../../assets/DashboardPage.png";

export default function LandingPage() {
  const features = [
    {
      icon: <Code className="w-6 h-6 text-cyan-400" />,
      title: "Smart Practice",
      description: "Curated problems matching your skill level"
    },
    {
      icon: <Target className="w-6 h-6 text-cyan-400" />,
      title: "Daily Challenges",
      description: "Stay consistent with daily coding exercises"
    },
    {
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      title: "Community Support",
      description: "Learn from peers and experienced programmers"
    }
  ];

  return (
    <div id="home" className="flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Master Competitive Programming
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 font-light">
                Your Ultimate Companion for CP Success
              </p>
              <p className="text-gray-400 text-lg max-w-xl">
                Personalized guidance, daily challenges, and expert insights to help you excel in competitive programming.
              </p>
            </div>

              <NavLink
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </NavLink>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-cyan-400/50 transition-all duration-200"
                >
                  <div className="mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur opacity-30"></div>
              <div className="relative">
                <img
                  src={Image}
                  alt="Competitive Programming"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}