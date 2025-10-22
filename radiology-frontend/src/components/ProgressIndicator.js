import React, { useEffect, useState } from "react";
import "../styles/ProgressIndicator.css";

const ProgressIndicator = ({ isProcessing }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + 1 : 100));
      }, 30); // Speed of progress

      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  return (
    <div className="progress-indicator-container">
      <div className="loading-text">Loading...</div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="progress-percent">{progress}%</div>
    </div>
  );
};

export default ProgressIndicator;
