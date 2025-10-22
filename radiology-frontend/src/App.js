import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UploadPage from "./pages/UploadPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultsPage from "./pages/ResultsPage"; // Import ResultsPage component
import videoSrc from "./assets/24063143.mp4";
import "./styles/IntroVideo.css";

function App() {
  const [introDone, setIntroDone] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 8;
      video.play();

      const handleTimeUpdate = () => {
        if (video.currentTime >= 14) {
          video.pause();
          setIntroDone(true);
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  if (!introDone) {
    return (
      <div className="intro-video-container">
        <video
          ref={videoRef}
          className="intro-video"
          src={videoSrc}
          type="video/mp4"
          muted
          playsInline
        />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} /> 
        <Route path="/results" element={<ResultsPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
