import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadBox = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "application/dicom": [".dcm"]
    },
    multiple: false
  });

  // Handle Analyze button click
  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      setError("Please upload an image first!");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Make the POST request to the backend API
      const response = await axios.post('http://localhost:5000/predict', formData);

      // Check if response data is valid
      if (!response.data?.predictions || !response.data?.image_url) {
        throw new Error("Invalid response format from server");
      }

      // Navigate to the results page with prediction data
      navigate("/results", {
        state: {
          resultData: {
            diseases: response.data.predictions,
            originalImageUrl: response.data.image_url,
            gradCamImageUrl: response.data.heatmap_urls
          }
        }
      });

    } catch (error) {
      console.error("Analysis error:", error);
      setError(error.response?.data?.error || "Analysis failed. Please try again.");
      alert("Error from backend: " + (error.response?.data?.error || error.message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="upload-box">
      <p className="upload-description">
        Seamlessly upload your chest X-ray or CT Scan to begin the AI-driven diagnosis.
      </p>

      <div {...getRootProps()} className={`upload-icon ${isDragActive ? "active-drop" : ""}`}>
        <input {...getInputProps()} />
        <CloudUploadIcon style={{ fontSize: 50 }} />
        <p className="upload-text">
          {isDragActive ? "Drop the file here" : "Drag & Drop or Click to Upload"}
        </p>
      </div>

      {error && <div className="upload-error">{error}</div>}

      <div className="upload-instruction-container">
        <div className="upload-instruction">
          <InfoOutlinedIcon style={{ fontSize: 16 }} />
          <span> Instructions while uploading image</span>
        </div>
        <div className="tooltip-text">
          <p>✔ Accepted formats: DICOM, PNG, JPEG</p>
          <p>✔ Ensure the image is clear for accurate results</p>
          <p>✔ Avoid rotated or cropped X-rays</p>
        </div>
      </div>

      <button 
        className="analyze-button" 
        onClick={handleAnalyzeClick}
        disabled={!selectedFile || isAnalyzing}
      >
        {isAnalyzing ? "Analyzing..." : "Start Analyze"}
        {!isAnalyzing && <ArrowForwardIosIcon style={{ fontSize: 18 }} />}
      </button>
    </div>
  );
};

export default UploadBox;
