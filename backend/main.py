from fastapi import FastAPI
from fastapi import UploadFile, File
from app.services.emotion_service import model
import numpy as np
import cv2
import json

app = FastAPI()

EMOTIONS = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
    "Neutral"
]

@app.get("/")
def home():
    return {
        "status": "Backend running",
        "model_loaded": True
    }

@app.get("/predict")
def predict():
    dummy_image = np.random.rand(1, 48, 48, 1).astype("float32")

    prediction = model.predict(dummy_image)

    emotion_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    return {
        "emotion": EMOTIONS[emotion_index],
        "confidence": round(confidence, 4)
    }

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    contents = await file.read()

    image_array = np.frombuffer(contents, np.uint8)

    image = cv2.imdecode(image_array, cv2.IMREAD_GRAYSCALE)

    # Resize to model input size
    image = cv2.resize(image, (48, 48))

    # Normalize
    image = image.astype("float32") / 255.0

    # Add batch + channel dimensions
    image = image.reshape(1, 48, 48, 1)

    prediction = model.predict(image)

    emotion_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    emotion = EMOTIONS[emotion_index]

    return {
        "emotion" : emotion,
        "confidence" : round(confidence,4)
        
    }