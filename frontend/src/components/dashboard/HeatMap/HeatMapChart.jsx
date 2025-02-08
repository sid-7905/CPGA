import React, { useState } from 'react';
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./HeatMapStyle.css";

const DynamicHeatMap = ({ heatMapData }) => {
  const [timeOffset, setTimeOffset] = useState(0); // Number of 9-month periods to look back

  // Calculate date ranges
  const calculateDateRange = () => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - (9 * timeOffset));
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 9);
    return { startDate, endDate };
  };

  const { startDate, endDate } = calculateDateRange();

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

  const handlePrevious = () => {
    setTimeOffset(prev => prev + 1);
  };

  const handleNext = () => {
    setTimeOffset(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="w-full p-4">
      <div className="text-white flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-semibold text-gray-200">Activity Heatmap</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={timeOffset === 0}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="w-full relative">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={transformedData}
            classForValue={getClassForValue}
            tooltipDataAttrs={(value) => ({
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": value && value.date 
                ? `${formatDate(value.date)}: ${value.count} contributions` 
                : 'No contributions',
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

export default DynamicHeatMap;