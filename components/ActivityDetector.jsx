import React, { useEffect, useRef } from "react";

function ActivityDetector({ onInactive }) {
  const lastActivityTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    const checkActivity = () => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivityTimeRef.current;
      if (inactiveTime > 10 * 60 * 1000) {
        onInactive();
      }
    };

    // Set up event listeners for mouse and keyboard events
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);

    // Set up a timer to check for inactivity periodically
    const intervalId = setInterval(checkActivity, 10000); // Check every 10 seconds

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
      clearInterval(intervalId);
    };
  }, [onInactive]);

  return null;
}

export default ActivityDetector;
