import React, { useState } from "react";
import { Grid, Card, Button, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import '../styles/ResultsDisplay.css';  
import '../styles/ResultsPage.css';

const ResultsDisplay = ({ diseases, originalImageUrl, gradCamImageUrl }) => {
  const [imageView, setImageView] = useState("original");

  const handleImageToggle = (event, newView) => {
    if (newView !== null) {
      setImageView(newView);
    }
  };

  console.log("Original Image URL:", originalImageUrl);
  console.log("GradCAM Image URL:", gradCamImageUrl);

  return (
    <div className="results-container">
      {/* Header Section */}
<div style={{ textAlign: "center" }}>
  <div className="results-header">
    The following diseases were predicted based on your uploaded image
  </div>
</div>


      {/* Predicted Diseases List */}
      <Grid container spacing={3} className="disease-list">
        {diseases.map((disease, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="disease-card" style={{ background: 'transparent', boxShadow: 'none' }}>
              <Typography variant="h6" fontWeight="bold">{disease.name}</Typography>
              <Typography variant="body1">Confidence: {disease.confidence}%</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Grad-CAM Image Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card className="image-container" style={{ background: 'transparent', boxShadow: 'none'}}>
            <Typography variant="h6" fontWeight="bold" color="white">Radiology Image</Typography>
            {imageView === "original" ? (
  <img 
    src={originalImageUrl}
    alt="Original Radiology"
    className="radiology-image"
  />
) : (




)}
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card className="image-container" style={{ background: 'transparent', boxShadow: 'none'}}>
            <Typography variant="h6" fontWeight="bold" color="white">Heatmap Visualization</Typography>
            <Typography variant="body2" color="white">
              Toggle between the original image and Grad-CAM heatmap visualization for deeper insights.
            </Typography>
            <ToggleButtonGroup
              value={imageView}
              exclusive
              onChange={handleImageToggle}
              className="toggle-group"
            >
              <ToggleButton value="original">Original Image</ToggleButton>
              <ToggleButton value="gradcam">Grad-CAM</ToggleButton>
            </ToggleButtonGroup>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Button variant="contained" color="primary">Download Report</Button>
        
      </div>

      {/* Footer */}
      
    </div>
  );
};

export default ResultsDisplay;
