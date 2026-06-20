from fastapi import FastAPI
from app.services.emotion_service import model

app = FastAPI()

@app.get("/")
def home():
    return {
        "status": "Backend running",
        "model_loaded": True
    }