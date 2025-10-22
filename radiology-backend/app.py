from flask import Flask, request, jsonify, send_from_directory
import os
import uuid
from utils.models_utils import *
from flask_cors import CORS
import tensorflow as tf
import cv2
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configuration
app.config.update(
    UPLOAD_FOLDER='uploads',
    GRADCAM_FOLDER='static/gradcam',
    ALLOWED_EXTENSIONS={'png', 'jpg', 'jpeg'}
)

# Initialize
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['GRADCAM_FOLDER'], exist_ok=True)
model = load_model('model/Chest_XRay_Diagnosis_Model_new.h5')


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Save file
        filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Preprocess image
        img_array = preprocess_image(filepath)

        # Get predictions
        preds = model.predict(img_array, verbose=0)[0]
        results = []
        heatmap_urls = []

        server_url = "http://localhost:5000"

        for i, prob in enumerate(preds):
            if prob >= 0.5:
                label = LABELS[i]
                confidence = float(round(prob * 100, 2))
                results.append({'name': label, 'confidence': confidence})

                # Generate Grad-CAM for this class
                gradcam_image = generate_gradcam(model, img_array, filepath, class_index=i)
                gradcam_filename = f"{label}_gradcam_{filename}"
                gradcam_path = os.path.join(app.config['GRADCAM_FOLDER'], gradcam_filename)
                cv2.imwrite(gradcam_path, gradcam_image)
                heatmap_urls.append(f"{server_url}/gradcam/{gradcam_filename}")

        # If no disease detected
        if not results:
            results.append({'name': 'Normal', 'confidence': 100.0})

        return jsonify({
            'predictions': results,
            'image_url': f"{server_url}/uploads/{filename}",
            'heatmap_urls': heatmap_urls
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/uploads/<path:filename>')
def get_uploaded_file(filename):
    return send_from_directory('uploads', filename)


@app.route('/gradcam/<path:filename>')
def get_gradcam_file(filename):
    return send_from_directory('static/gradcam', filename)


if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)
