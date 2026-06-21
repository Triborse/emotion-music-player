from fastapi import FastAPI
from fastapi import UploadFile, File
from app.services.emotion_service import model
import numpy as np
import cv2
import json
from fastapi.middleware.cors import CORSMiddleware
from app.routes.music_routes import router as music_router
from app.routes.history_routes import router as history_router
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)

app = FastAPI()
app.include_router(music_router)
app.include_router(history_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    faces = face_cascade.detectMultiScale(
        image,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(50, 50)
    )

    if len(faces) == 0:
        return {
            "emotion": None,
            "confidence": 0,
            "face_detected": False
        }

    x, y, w, h = max(
        faces,
        key=lambda face: face[2] * face[3]
    )

    image = image[y:y+h, x:x+w]
    image = cv2.resize(image, (48, 48))

    image = image.astype("float32") / 255.0

    image = image.reshape(1, 48, 48, 1)

    prediction = model.predict(image)

    emotion_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    emotion = EMOTIONS[emotion_index]

    print(
        f"Emotion: {emotion}, Confidence: {round(confidence,4)}"
    )

    return {
        "emotion": emotion,
        "confidence": round(confidence, 4)
    }
