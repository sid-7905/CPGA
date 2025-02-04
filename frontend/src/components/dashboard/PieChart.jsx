import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CPStatsPieChart = ({ Count, Title }) => {
  const data = {
    labels: ["CodeChef", "CodeForces", "LeetCode"],
    datasets: [
      {
        data: [Count.CodeChef, Count.CodeForces, Count.LeetCode],
        backgroundColor: ["#0CB5B4", "#A7E435", "#2BB845"],
        hoverBackgroundColor: ["#0dcfce", "#b5f83d", "#32d450"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            return `Problems Solved: ${context.raw}`;
          },
        },
      },
    },
    cutout: "70%",
  };

  const totalProblems = Count.CodeChef + Count.CodeForces + Count.LeetCode;

  return (
    <div className="bg-gray-900 rounded-xl flex flex-col items-center justify-center shadow-lg w-full">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        {Title}
      </h2>
      <div className=" absolute flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {totalProblems}
              </div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </div>

      {totalProblems > 0 ? (
        <div className="flex flex-col items-center p-2 w-4/5 justify-center">
          <Pie data={data} options={options} />

          <div className="flex items-center justify-center gap-4 mt-6">
            {[
              { name: "CodeChef", count: Count.CodeChef, color: "#0CB5B4" },
              { name: "CodeForces", count: Count.CodeForces, color: "#A7E435" },
              { name: "LeetCode", count: Count.LeetCode, color: "#2BB845" },
            ].map((platform) => (
              <div key={platform.name} className="text-center">
                <div
                  className="text-lg font-bold"
                  style={{ color: platform.color }}
                >
                  {platform.count}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {platform.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-red-400 text-center py-8 text-lg">
          No problems solved yet
        </div>
      )}
    </div>
  );
};

export default CPStatsPieChart;
