import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

const Calendar = ({ problems, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { currentStreak, longestStreak } = useMemo(() => {
    // Sort problems by date
    const sortedProblems = [...problems].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = new Date();

    // Calculate current streak
    for (const problem of sortedProblems) {
      const problemDate = new Date(problem.date);
      const dayDiff = Math.floor(
        (lastDate - problemDate) / (1000 * 60 * 60 * 24)
      );

      if (problem.status === "solved") {
        if (dayDiff <= 1 || currentStreak === 0) {
          currentStreak++;
          lastDate = problemDate;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Calculate longest streak
    lastDate = null;
    for (const problem of sortedProblems) {
      if (problem.status === "solved") {
        if (!lastDate) {
          tempStreak = 1;
        } else {
          const dayDiff = Math.floor(
            (lastDate - new Date(problem.date)) / (1000 * 60 * 60 * 24)
          );
          if (dayDiff <= 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        lastDate = new Date(problem.date);
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }, [problems]);

  const getDayColor = (date) => {
    const problem = problems.find((p) => {
      const pDate = new Date(p.date);
      return pDate.toDateString() === date.toDateString();
    });

    if (!problem) return "bg-gray-800";
    if (problem.status === "solved") return "bg-cyan-600";
    return "bg-gray-500";
  };

  const getFormattedDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    const daysFromPrevMonth = firstDay.getDay();
    const prevMonth = new Date(year, month, 0);
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.unshift(new Date(year, month - 1, prevMonth.getDate() - i));
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const allDays = getDaysInMonth(currentDate);
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-gray-900 p-6 rounded-xl w-80 sm:w-96 shadow-xl">
     
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-medium text-lg">Problem Activity</h3>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigateMonth(-1)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-white font-medium">{monthYear}</span>
          <button 
            onClick={() => navigateMonth(1)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-xs text-gray-400 text-center font-medium mb-2">
            {day}
          </div>
        ))}
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((date, dateIndex) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              return (
                <button
                  key={dateIndex}
                  onClick={() => onDayClick(date)}
                  title={getFormattedDate(date)}
                  className={`
                    w-8 h-8 rounded-md transition-all duration-200
                    ${isCurrentMonth ? getDayColor(date) : 'bg-gray-900 opacity-40'}
                    hover:ring-2 hover:ring-cyan-400 hover:ring-opacity-50
                    ${date.toDateString() === new Date().toDateString() 
                      ? 'ring-2 ring-cyan-400' 
                      : ''}
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                  `}
                  aria-label={getFormattedDate(date)}
                >
                  <span className={`text-xs ${isCurrentMonth ? 'text-gray-300' : 'text-gray-500'}`}>
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
       {/* Streak Display */}
       <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={20} />
          <div className="flex gap-4">
            <div className="text-sm">
              <span className="text-gray-400">Current:</span>
              <span className="text-white ml-1 font-medium">{currentStreak}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Longest:</span>
              <span className="text-white ml-1 font-medium">{longestStreak}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Calendar;