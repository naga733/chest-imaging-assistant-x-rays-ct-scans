import React, { useEffect, useRef, useState } from "react";
import "../styles/IntroVideo.css";
import "../styles/Uploader.css";
import videoSrc from "../assets/24063143.mp4";
import UploadPage from "../pages/UploadPage";

const IntroVideo = () => {
  const videoRef = useRef(null);
  const [showMain, setShowMain] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current.currentTime >= 14) {
        setFadeOut(true);
        setTimeout(() => {
          setShowMain(true);
          setTriggerAnimation(true);
        }, 1000); // wait for fade-out to complete
      }
    };

    const videoElement = videoRef.current;
    videoElement.currentTime = 8;
    videoElement.play();
    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <>
      {showMain ? (
        <div className={`fade-in-ui ${triggerAnimation ? "vibrate-ui" : ""}`}>
          <UploadPage />
        </div>
      ) : (
        <div className={`intro-video-container ${fadeOut ? "fade-out" : ""}`}>
          <video
            ref={videoRef}
            className="intro-video"
            src={videoSrc}
            type="video/mp4"
            muted
            playsInline
          />
        </div>
      )}
    </>
  );
};

export default IntroVideo;
