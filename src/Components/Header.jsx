import React, { useEffect, useState } from "react";
import "moment/dist/locale/ar"; // Import Arabic locale
import moment from "moment";

const Header = ({ arName, times }) => {
  const [today, setToday] = useState("");
  const [timeLeft, setTimeLeft] = useState(times?.time || 0);
  useEffect(() => {
    // Reset the timer when `times` changes
    setTimeLeft(times?.time || 0);
  }, [times]);

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop the timer if time reaches zero

    // Set an interval to decrease the time every second
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1000); // Decrease time by 1000 milliseconds (1 second)
    }, 1000);

    // Clear the interval when the component is unmounted or when timeLeft changes
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Convert milliseconds to HH:MM:SS format
  const convertMillisecondsToTime = (milliseconds) => {
    if (isNaN(milliseconds) || milliseconds < 0) {
      return "00:00:00"; // Fallback in case of invalid input
    }

    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    // Add leading zeros if needed
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const t = moment();
    setToday(t.format("D-M-YYYY | h:mm"));
  }, []);

  return (
    <div className="flex gap-3 items-center border-b-2 border-[#ececec11] pb-6">
      <div>
        <h4 className="sm:text-xl mb-3">{today}</h4>
        <h3 className="font-bold text-xl sm:text-3xl">
          {arName == null ? "الإسماعيلية" : arName}
        </h3>
      </div>
      <div className="mx-auto">
        <h4 className="sm:text-xl mb-3">متبقي علي صلاه {times?.name}</h4>
        <h3 className="font-bold text-xl sm:text-3xl">
          {convertMillisecondsToTime(timeLeft)}
        </h3>
      </div>
    </div>
  );
};

export default Header;
