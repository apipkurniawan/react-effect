import React, { useEffect, useState } from 'react';

function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('INTERVAL SET...');
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 10);
    }, 10);

    return () => {
      console.log('CLEANING UP INTERVAL...');
      clearInterval(interval);
    };
  }, []);

  return <progress value={remainingTime} max={timer} />;
}

export default ProgressBar;
