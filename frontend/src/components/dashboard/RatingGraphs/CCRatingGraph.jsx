import React from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CodeChefRatingGraph = ({ ratingData }) => {

  if (!ratingData || ratingData.length === 0) {
    return (
      <div className="w-full max-w-3xl rounded-lg shadow-sm">
        <div className="p-6">
          <div
            className="flex items-center justify-center h-[400px]"
            aria-live="polite"
          >
            <p className="text-red-500">
              No contest participation data available
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formattedData = ratingData.map((entry) => ({
    ...entry,
    month: new Date(entry.end_date).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    }),
  }));

  const minRating = Math.min(...formattedData.map((entry) => entry.rating));
  const maxRating = Math.max(...formattedData.map((entry) => entry.rating));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-600 p-4 border rounded shadow-md">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-xs text-white">
            Rating: {data.rating}
            <br />
            Rank: {data.rank}
            <br />
            Date:{" "}
            {new Date(data.end_date).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-3xl rounded-lg shadow-sm">
      <h2 className="text-xl text-center font-semibold text-cyan-600 mb-1">
        CodeChef Rating Progress
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#000000" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#4a5568" }}
              tickFormatter={(value) => value.split(" ")[0]}
            />
            <YAxis
              domain={[Math.max(0, minRating - 100), maxRating + 100]}
              tick={{ fill: "#4a5568" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#4299e1"
              activeDot={{ r: 8 }}
              strokeWidth={1}
              dot={{ fill: "#fff", stroke: "#4299e1", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CodeChefRatingGraph;
