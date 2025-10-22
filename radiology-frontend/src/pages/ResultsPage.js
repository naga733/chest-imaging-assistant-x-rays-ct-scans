import React from "react";
import {  Button,  Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ResultsDisplay from "../components/ResultsDisplay";

import HomeIcon from "@mui/icons-material/Home";
import "../styles/ResultsPage.css"; // Ensure this line exists and correct

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultData, error } = location.state || {};

  if (error) {
    return (
      <div className="error-container">
        <h2>Analysis Failed</h2>
        <p>{error}</p>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
        >
          Back to Upload
        </Button>
      </div>
    );
  }

  if (!resultData?.diseases) {
    return (
      <div className="error-container">
        <h2>No Results Found</h2>
        <p>Please upload and analyze an image first.</p>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
        >
          Back to Upload
        </Button>
      </div>
    );
  }

  return (
    <div className="results-page">
      {/* 🔁 Background Video */}
      <video
        className="results-bg-video"
        src={require("../assets/istockphoto-999837164-640_adpp_is.mp4")}
        autoPlay
        muted
        playsInline
        loop={true}
       
       
      />

<h1 className="diagnosis-heading">
  <span className="highlight-left">Diagnosis</span>
  <span className="highlight-right">Results</span>
</h1>

      <ResultsDisplay
        diseases={resultData.diseases}
        originalImageUrl={resultData.originalImageUrl}
        gradCamImageUrl={resultData.gradCamImageUrl}
      />
      <div className="action-buttons">
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          style={{ marginRight: "10px" }}
        >
          Analyze Another Image
        </Button>
      </div>
      <div className="footer">
              <Typography variant="body2">© 2025 Radiology AI. All rights reserved.</Typography>
            </div>
    </div>
  );
};

export default ResultsPage;
