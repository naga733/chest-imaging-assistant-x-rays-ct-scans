import React from "react";
import ProgressIndicator from "../components/ProgressIndicator";
import "../styles/ProgressIndicator.css";

const ProcessingPage = () => {
  return (
    <div className="processing-page">
      <ProgressIndicator isProcessing={true} />
    </div>
  );
};

export default ProcessingPage;
