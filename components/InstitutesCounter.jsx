import React, { useEffect, useState } from "react";

// Custom hook for setInterval with cleanup
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
const InstitutesCounter = ({count, setCount, docsLength}) => {
  

  useInterval(() => {
    if (count < docsLength) {
      setCount((prevCount) => prevCount + 1);
    }
  }, 25); // Interval duration in milliseconds

  return (
    <>
      <div className="flex-row lg:flex-col items-center justify-center">
        <span className="text-lg lg:text-4xl w-full lg:w-1/2 font-bold text-center">
          Institutes Registered
        </span>
        <h3 className="text-lg lg:text-3xl">{count}</h3>
      </div>
    </>
  );
};

export default InstitutesCounter;
