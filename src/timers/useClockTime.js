import { useState, useEffect } from "react";

const getTime = () => {
  const d = new Date();
  return {
    sec: d.getSeconds(),
    min: d.getMinutes(),
    hr: d.getHours() % 12
  };
};

export const useClockTime = () => {
  const [currentTime, setCurrentTime] = useState(getTime());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(getTime()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return currentTime;
};
