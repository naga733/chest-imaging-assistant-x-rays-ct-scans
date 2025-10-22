import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import UploadBox from "../components/UploadBox";
import "../styles/Uploader.css"; // Make sure styles are imported

const UploadPage = () => {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1000); // run animation once
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`upload-page ${animate ? "entry-animate" : ""}`}>
      <div className={`navbar-container ${animate ? "move-effect" : ""}`}>
        <NavigationBar />
      </div>
      <div className="content-area">
        <div className={`uploadbox-wrapper ${animate ? "move-effect" : ""}`}>
          <UploadBox />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
