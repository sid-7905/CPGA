import React from "react";

const Calendar = ({ problems, onDayClick }) => {
    const getDayColor = (date) => {
      const problem = problems.find((p) => {
        const pDate = new Date(p.date);
        return pDate.toDateString() === date.toDateString();
      });
  
      if (!problem) return "bg-gray-800";
      if (problem.status === "solved") return "bg-cyan-600";
      return "bg-gray-700";
    };
  
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 42); // Show last 6 weeks
  
    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= today) {
      if (currentDate.getDay() === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
  
      currentWeek.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);
  
    return (
      <div className="bg-gray-900 p-4 rounded-xl w-96">
        <h3 className="text-white font-medium mb-4">Problem Activity</h3>
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs text-gray-400 text-center">
              {day}
            </div>
          ))}
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((date, dateIndex) => (
                <button
                  key={dateIndex}
                  onClick={() => onDayClick(date)}
                  className={`w-6 h-6 rounded-sm transition-all ${getDayColor(
                    date
                  )} 
                    hover:ring-2 hover:ring-cyan-400 hover:ring-opacity-50`}
                  title={`${date.toDateString()}`}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
export default Calendar;