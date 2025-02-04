import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProblemPreference({ problemTags }) {
    const navigate = useNavigate();
    const handleOnClick = () => {
        navigate("/daily-problem-form");
      };
  return (
    <div className="py-6 border-b border-gray-700 h-full">
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div className="space-y-1 w-full sm:w-auto">
          <h2 className="text-sm font-medium text-gray-400">Selected Tags</h2>
          <div className="flex flex-wrap gap-2">
            {(
              problemTags || [
                "array",
                "math",
                "implementation",
              ]
            ).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleOnClick}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors
                        flex items-center gap-2"
        >
          <i className="fas fa-cog" />
          Change Preferences
        </button>
      </div>
    </div>
  );
}
