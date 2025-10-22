# SmartChest AI : Chest Imaging Assistant for X-rays and CT-scans

SmartChest AI is an intelligent, multimodal pipeline for automated analysis of chest radiology images — including both 2D X-rays and 3D CT scans. It supports disease detection through explainable visualizations (e.g., Grad-CAM for X-rays) and generates structured diagnostic reports (Findings & Impressions) from CT volumes using large language models.

The system combines a pretrained CT visual encoder (CT-ViT / CT-CLIP) with lightweight fine-tuning of a modern language model (LLaMA 3.1, 8B), optimized with 8-bit quantization (bitsandbytes) and LoRA adapters — enabling CT-to-text generation even on modest hardware like Google Colab (T4 GPU).

**NOTE** : This project is a proof-of-concept and is not a clinical diagnostic tool.

---

## Why CT-CLIP / CT-ViT?

CT volumes are large and require weeks of training on high-end GPUs to learn robust visual features. CT-CLIP/CT-ViT is a pretrained 3D vision transformer trained on medical CT data by the research authors — using it provides strong volumetric features without re-training a huge vision model. This dramatically reduces compute and data needs for a usable multimodal pipeline.

---

## SmartChest AI User Interface
![user interface](https://github.com/user-attachments/assets/59b5a98b-fcc4-4dc5-87d1-c734df2be869)


## Features
- Chest X-ray Disease Detection using DenseNet-121 Trained on a large NIH dataset to detect 14 common thoracic diseases such as Pneumonia, Fibrosis, Cardiomegaly, etc., with high AUC scores.

- Grad-CAM Heatmaps for Visual Explanation Generates heatmaps overlayed on X-rays to highlight the most influential areas contributing to predictions.

- 3D CT Scan Analysis using Vision Transformers (CT-ViT) Uses a 3D Vision Transformer architecture to analyze volumetric chest CT scans effectively, extracting contextual spatial information.

- Structured Report Generation using LLaMA-3.1 (8B) Automatically generates radiologist-style diagnostic reports from CT scans using a quantized LLaMA 3.1 (8B) LLM enhanced with LoRA fine-tuning and 8-bit quantization for resource-efficient training/inference.

- Modern Web Interface (React + Flask) Built with a stylish, animated frontend and a robust Flask backend. Smooth image upload, visual results, and progress animations enhance UX.

- Multi-Disease Prediction with Confidence Scores Detects multiple diseases simultaneously and displays each with a confidence score for interpretability.

- Downloadable Reports & Visuals Option to download PDF reports, heatmap overlays, and predictions for offline reference or record-keeping.

---

## Tech Stack

| Layer         | Technologies                                                                 |
|---------------|------------------------------------------------------------------------------|
| Frontend      | React.js, Material-UI, CSS, Axios, Framer Motion                            |
| Backend       | Flask, Python, TensorFlow, PyTorch, OpenCV                                  |
| Models        | DenseNet-121 (X-ray), CT-ViT (3D ViT for CT), Mistral-7B (LLM)              |
| NLP           | HuggingFace Transformers, LoRA adapter, 4-bit quantization (bitsandbytes)   |
| Visualization | Grad-CAM, ROC curves, Matplotlib                                            |
| Deployment    | Localhost (Flask + React) with future support for Heroku, AWS, etc.         |

---

## Real-World Motivation
Manual diagnosis of chest radiology is time-consuming and often inconsistent across practitioners. SmartChest AI addresses:

- Shortage of radiologists in rural or under-resourced settings.
- Variability in manual interpretations.
- Need for fast and explainable decision-making support in hospitals.

This project was built as part of a B.Tech major project at Mahatma Gandhi Institute of Technology (MGIT), Hyderabad (2024-2025)

---

## Demo Screenshots

### Upload Chest X-ray Image or CT scan Image and click Start Analyze Button
![uploading](https://github.com/user-attachments/assets/42eda40b-3b84-437e-aa8a-37fb49e5f0b3)

### Start’s Analyzing the Uploaded Chest X-ray or CT scan Image
![analyzing](https://github.com/user-attachments/assets/72aa3be2-a5ec-475e-8e7e-0549a8f7b4b9)


### Diagnosis Results of Uploaded Chest X-ray Image
![result](https://github.com/user-attachments/assets/e4c547be-d92f-4954-a197-d29001bb548c)


### Disease Findings of Chest X-ray Image through Grad-cam
![heatmap](https://github.com/user-attachments/assets/cd812059-0172-47ef-81d9-7ec68aefcf6b)


### Detail Description about the Findings and Impression of Uploaded CT Scan
![report](https://github.com/user-attachments/assets/15eed23e-2305-4e99-9d6a-cfee931e30c6)

---

## How It Works

### X-Ray Pipeline
- Upload chest X-ray (JPG/PNG).
- Image is resized and normalized.
- DenseNet-121 predicts 14 diseases from NIH ChestX-ray14.
- Grad-CAM heatmaps highlight regions influencing predictions.
- Visual + textual output shown in results UI.
### CT Pipeline
- Upload CT Scan in NIfTI format.
- Preprocessing includes HU clipping & isotropic resampling.
- CT-ViT extracts spatio-temporal embeddings.
- A projection head aligns the CT feature vector with the LLaMA-3.1 (8B) embedding space.
- The LoRA-fine-tuned LLM generates a radiology-style Findings & Impression report conditioned on the projected CT token.

---
  
## Future Scope
- Integrate cloud deployment (Render/Heroku/AWS EC2)
- Add DICOM viewer & 3D CT slice navigator
- Improve CT-ViT training using larger curated datasets
- Add patient data integration for real-world deployments
- Add user authentication and report saving features

---

### Chest X-ray Classification

The model achieved 85.65% accuracy on the held-out test set. Class-wise ROC-AUC scores were highest for clinically significant conditions: Edema (0.977), Hernia (0.970), Emphysema (0.956), and Fibrosis (0.915). Moderate AUCs were observed for Mass (0.867) and Atelectasis (0.879), reflecting the complexity and overlap of these categories.

Given the multi-label setting and class imbalance, macro-level metrics were lower: Precision ≈ 40%, Recall ≈ 56%, F1 ≈ 44%. These scores highlight the challenge of consistent performance across all classes and suggest areas for improvement through data augmentation or class-balanced training.

### CT → Report Generation

Semantic evaluation using BERTScore (F1 ≈ 0.84) shows strong alignment between generated and reference reports. Keyword-level evaluation on critical terms (e.g., nodule, ground-glass, consolidation) yielded F1 ≈ 0.70 (Precision ≈ 0.64, Recall ≈ 0.78), indicating reliable inclusion of key findings.

Fine-tuning LoRA adapters on projected CT embeddings led to clearer, more clinically relevant language in both Findings and Impressions, reducing generic or off-topic text.

---

# **Acknowledgements:**
The CT visual feature extractor (CT-ViT / CT-CLIP) and the CT-RATE dataset used in this project were created and released by Ibrahim Hamamcı and collaborators. Their weeks-long training on high-performance GPUs and their decision to share the artifacts made this project possible. Original repositories/dataset pages:

CT-CLIP: https://github.com/ibrahimethemhamamci/CT-CLIP

CT-RATE dataset: https://huggingface.co/datasets/ibrahimhamamci/CT-RATE

---

## Authors
- Bonam Naga Suresh – 21261A0508
- Kandula Sai Grahith – 21261A0519

Project under guidance of Dr. C.R.K Reddy and Dr. Meera Alphy, Department of CSE, MGIT, Hyderabad.

---
