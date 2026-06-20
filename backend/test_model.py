import json
import tensorflow as tf
import numpy as np

# Load config
with open("model/emotion_model.keras/config.json", "r") as f:
    config = json.load(f)

# Remove unsupported field
for layer in config["config"]["layers"]:
    if "config" in layer and "quantization_config" in layer["config"]:
        del layer["config"]["quantization_config"]

# Build model
model = tf.keras.models.model_from_json(json.dumps(config))

# Load weights
model.load_weights("model/emotion_model.keras/model.weights.h5")

# Create dummy image
dummy_image = np.random.rand(1, 48, 48, 1).astype("float32")

# Predict
prediction = model.predict(dummy_image)

print("Prediction Shape:", prediction.shape)
print("Prediction Values:", prediction)
print("Predicted Class Index:", np.argmax(prediction))