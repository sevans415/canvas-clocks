import { useState, useEffect } from "react";

export const secsToTime = secs => ({
  sec: secs % 60,
  min: Math.floor((secs / 60) % 60),
  hr: Math.floor((secs / (60 * 60)) % 12)
});

export const useStopwatch = animateReset => {
  const [isPaused, setIsPaused] = useState(true);
  const [stopwatchCounter, setStopwatchCounter] = useState(0);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(
        () => setStopwatchCounter(prevTime => prevTime + 1),
        1000
      );
      return () => {
        clearInterval(interval);
      };
    }
  }, [isPaused]);

  const resetStopwatch = () => {
    animateReset(secsToTime(stopwatchCounter));
    setIsPaused(true);
    setStopwatchCounter(0);
  };

  return {
    resetStopwatch,
    isPaused,
    stopwatchTime: secsToTime(stopwatchCounter),
    togglePause: () => setIsPaused(prevPause => !prevPause)
  };
};
