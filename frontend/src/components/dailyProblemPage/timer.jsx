import React, { useState, useEffect } from "react";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  // Function to calculate time remaining until midnight
  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to midnight of the next day
    const difference = midnight - now;

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Clean up timer on component unmount
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 text-center auto-cols-max w-full">
      <div className="flex flex-col p-2 bg-cyan-500 rounded-lg">
        <span className="countdown font-mono text-xl text-white">
          <span style={{ "--value": timeLeft.hours }}>{timeLeft.hours}</span>
        </span>
      </div>
      <p className="text-cyan-300 text-bold text-lg">:</p>
      <div className="flex flex-col p-2 bg-cyan-500 rounded-lg">
        <span className="countdown font-mono text-xl text-white">
          <span style={{ "--value": timeLeft.minutes }}>{timeLeft.minutes}</span>
        </span>
      </div>
      <p className="text-cyan-300 text-bold text-lg">:</p>
      <div className="flex flex-col p-2 bg-cyan-500 rounded-lg">
        <span className="countdown font-mono text-xl text-white">
          <span style={{ "--value": timeLeft.seconds }}>{timeLeft.seconds}</span>
        </span>
      </div>
    </div>
  );
};

export default Countdown;