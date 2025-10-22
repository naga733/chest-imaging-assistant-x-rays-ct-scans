import React, { useState } from "react";
import "./../styles/Uploader.css";

const NavigationBar = () => {
  const [showAbout, setShowAbout] = useState(false);

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-title">
          <div className="frame">SmartChest AI</div>
        </div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Upload</a>
          <a href="#">My reports</a>
          <a href="#" onClick={toggleAbout}>About AI</a>
          <a href="#">Help</a>
        </div>
      </div>

      {showAbout && (
  <div className="about-overlay">
    <div className="about-modal-box">
      <h2>About SmartChest AI</h2>
      <p>
        SmartChest AI is a deep learning-powered tool designed to assist in the interpretation of chest X-rays. It can detect 14 key thoracic abnormalities to support early diagnosis and improve clinical outcomes.
      </p>
      <div className="scrollable-list">
        <ul>
          <li><strong>1. Atelectasis:</strong> Detects lung collapse or closure, where part of the lung is deflated.</li>
          <li><strong>2. Cardiomegaly:</strong> Identifies abnormal enlargement of the heart, often linked to heart failure or other conditions.</li>
          <li><strong>3. Effusion:</strong> Recognizes fluid accumulation between the lungs and chest wall (pleural effusion).</li>
          <li><strong>4. Infiltration:</strong> Detects substances (like pus or blood) within lung tissue, indicating infection or inflammation.</li>
          <li><strong>5. Mass:</strong> Spots large, abnormal tissue growths which could be benign or malignant.</li>
          <li><strong>6. Nodule:</strong> Identifies small, round opacities that may require follow-up for possible malignancy.</li>
          <li><strong>7. Pneumonia:</strong> Detects infection in the lungs that causes inflammation and fluid-filled air sacs.</li>
          <li><strong>8. Pneumothorax:</strong> Recognizes air in the pleural space, causing the lung to collapse.</li>
          <li><strong>9. Consolidation:</strong> Identifies lung areas filled with liquid instead of air, often caused by pneumonia.</li>
          <li><strong>10. Edema:</strong> Detects excess fluid in the lungs, often due to heart failure.</li>
          <li><strong>11. Emphysema:</strong> Identifies damage to air sacs (alveoli) in the lungs, commonly seen in COPD patients.</li>
          <li><strong>12. Fibrosis:</strong> Detects scarring and thickening of lung tissue that affects breathing capacity.</li>
          <li><strong>13. Pleural Thickening:</strong> Spots thickened pleura, which can result from infection, asbestos exposure, or chronic inflammation.</li>
          <li><strong>14. Hernia:</strong> Detects diaphragmatic hernia where abdominal contents push into the chest cavity.</li>
        </ul>
      </div>
      <button onClick={toggleAbout}>Close</button>
    </div>
  </div>
)}


    </>
  );
};

export default NavigationBar;
