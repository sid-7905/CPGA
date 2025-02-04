import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CodeforcesRatingGraph = ({ ratingData }) => {
  if (!ratingData || ratingData.length === 0) {
    return <p className="text-red-500">No contest participation data available</p>;
  }

  const formattedData = ratingData.map((entry) => ({
    ...entry,
    date: new Date(entry.ratingUpdateTimeSeconds * 1000).toLocaleString(
      "en-IN",
      {
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }
    ),
    ratingChange: entry.newRating - entry.oldRating,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="bg-gray-600 p-4 border text-white rounded shadow-md"
        >
          <p>
            <strong>Contest:</strong> {data.contestName}
          </p>
          <p>
            <strong>Rating:</strong> {data.newRating} (
            {data.ratingChange > 0
              ? `+${data.ratingChange}`
              : data.ratingChange}
            )
          </p>
          <p>
            <strong>Rank:</strong> {data.rank}
          </p>
          <p>
            <strong>Date:</strong> {data.date}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-3xl rounded-lg shadow-sm">
      <h2 className="text-xl text-center font-semibold text-cyan-600 mb-1">Codeforces Rating Progress</h2>
      <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
          <CartesianGrid stroke="#000000" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{
              value: "Contests",
              position: "insideBottomRight",
              offset: -10,
            }}
            />
          <YAxis
            label={{ value: "Rating", angle: -90, position: "insideLeft" }}
            />
          <Tooltip content={<CustomTooltip />} />
          <Legend/>
          <Line
            type="monotone"
            dataKey="newRating"
            stroke="#555555"
            dot={{ r: 3 }}
            activeDot={{ r: 8 }}
            />
        </LineChart>
      </ResponsiveContainer>
            </div>
    </div>
  );
};

export default CodeforcesRatingGraph;
