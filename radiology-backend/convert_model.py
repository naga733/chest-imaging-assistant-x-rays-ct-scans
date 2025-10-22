import os
import tensorflow as tf

def convert_model():
    # Get absolute paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'model', 'pretrained_model.h5')
    output_path = os.path.join(current_dir, 'model', 'converted_model')
    
    print(f"Looking for model at: {model_path}")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    
    try:
        model = tf.keras.models.load_model(
            model_path,
            custom_objects={
                'weighted_loss': lambda y_true, y_pred: tf.keras.losses.binary_crossentropy(y_true, y_pred),
                'AUC': tf.keras.metrics.AUC,
                'Precision': tf.keras.metrics.Precision,
                'Recall': tf.keras.metrics.Recall
            }
        )
        model.save(output_path, save_format='tf')
        print(f"Model successfully converted to {output_path}")
    except Exception as e:
        print(f"Conversion failed: {str(e)}")
        raise

if __name__ == '__main__':
    convert_model()