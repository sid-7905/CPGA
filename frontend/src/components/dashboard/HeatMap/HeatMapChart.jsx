import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "./HeatMapStyle.css";

const HeatMapChart = ({ heatMapData }) => {
  const transformedData = heatMapData.map((item) => ({
    date: item.date,
    count: item.value,
  }));

  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getClassForValue = (value) => {
    if (!value) return "color-empty";
    if (value.count < 20) return "color-scale-1";
    if (value.count < 40) return "color-scale-2";
    if (value.count < 60) return "color-scale-3";
    return "color-scale-4";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full p-4">
      <div className="text-white flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-semibold text-gray-200">Activity Heatmap</h3>
        
        <div className="w-full relative">
          <CalendarHeatmap
            startDate={new Date("2024-04-01")}
            endDate={new Date("2024-12-31")}
            values={transformedData}
            classForValue={getClassForValue}
            tooltipDataAttrs={(value) => ({
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": value && value.date 
                ? `${formatDate(value.date)}: ${value.count} contributions` 
                : "No contributions",
            })}
            showWeekdayLabels={true}
            weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
            monthLabels={monthLabels}
            gutterSize={4}
          />
          <Tooltip 
            id="heatmap-tooltip"
            style={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              color: '#fff',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-sm color-empty"></div>
            <div className="w-4 h-4 rounded-sm color-scale-1"></div>
            <div className="w-4 h-4 rounded-sm color-scale-2"></div>
            <div className="w-4 h-4 rounded-sm color-scale-3"></div>
            <div className="w-4 h-4 rounded-sm color-scale-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMapChart;