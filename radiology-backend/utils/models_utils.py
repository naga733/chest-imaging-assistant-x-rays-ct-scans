# models_utils.py
import os
import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.utils import load_img, img_to_array

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')

LABELS = [
    'Atelectasis', 'Cardiomegaly', 'Effusion', 'Infiltration', 'Mass',
    'Nodule', 'Pneumonia', 'Pneumothorax', 'Consolidation', 'Edema',
    'Emphysema', 'Fibrosis', 'Pleural_Thickening', 'Hernia'
]

def weighted_loss(y_true, y_pred):
    pos_weights = [0.106, 0.02, 0.033, 0.016, 0.128, 0.013, 0.014, 0.002, 0.175, 0.045, 0.054, 0.021, 0.01, 0.038]
    neg_weights = [0.894, 0.98, 0.967, 0.984, 0.872, 0.987, 0.986, 0.998, 0.825, 0.955, 0.946, 0.979, 0.99, 0.962]
    epsilon = 1e-7
    loss = 0.0
    for i in range(len(pos_weights)):
        loss_pos = -1 * tf.reduce_mean(pos_weights[i] * y_true[:, i] * tf.math.log(y_pred[:, i] + epsilon))
        loss_neg = -1 * tf.reduce_mean(neg_weights[i] * (1 - y_true[:, i]) * tf.math.log(1 - y_pred[:, i] + epsilon))
        loss += loss_pos + loss_neg
    return loss

def load_model(model_path):
    return tf.keras.models.load_model(
        model_path,
        custom_objects={
            'weighted_loss': weighted_loss,
            'AUC': tf.keras.metrics.AUC,
            'Precision': tf.keras.metrics.Precision,
            'Recall': tf.keras.metrics.Recall
        }
    )

def preprocess_image(img_path, target_size=(224, 224)):
    img = load_img(img_path, target_size=target_size)
    img_array = img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

def predict_disease(model, img_array, threshold=0.5):
    preds = model.predict(img_array, verbose=0)[0]
    return [
        {'name': LABELS[i], 'confidence': float(round(prob*100, 2))}
        for i, prob in enumerate(preds) if prob >= threshold
    ] or [{'name': 'Normal', 'confidence': 100}]

def generate_gradcam(model, img_array, orig_img_path, class_index, layer_name=None):
    import matplotlib.cm as cm

    if layer_name is None:
        for layer in reversed(model.layers):
            try:
                if len(layer.output.shape) == 4:
                    layer_name = layer.name
                    break
            except:
                continue

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = predictions[:, class_index]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap = tf.reduce_mean(tf.multiply(pooled_grads, conv_outputs), axis=-1)

    heatmap = np.maximum(heatmap, 0)
    heatmap /= np.max(heatmap) + 1e-8
    heatmap = heatmap.numpy() if isinstance(heatmap, tf.Tensor) else heatmap

    img = cv2.imread(orig_img_path)
    img = cv2.resize(img, (224, 224))
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    superimposed_img = cv2.addWeighted(img, 0.6, heatmap_color, 0.4, 0)

    label = LABELS[class_index]
    confidence = predictions[0][class_index].numpy() * 100
    text = f"{label}: {confidence:.2f}%"
    cv2.putText(superimposed_img, text, (10, 25),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    

    return superimposed_img
