import os
import random
from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

MUSIC_DIR = "music"
print("Current working directory:", os.getcwd())

@router.get("/recommend/{emotion}")
def recommend_song(emotion: str):

    emotion_folder = os.path.join(
        MUSIC_DIR,
        emotion
    )

    print("Looking for:", emotion_folder)

    if not os.path.exists(emotion_folder):
        return {
            "error": "Emotion folder not found"
        }
    songs = [
        file
        for file in os.listdir(emotion_folder)
        if file.endswith(".mp3")
    ]

    if not songs:
        return {
            "error": "No songs found"
        }

    song = random.choice(songs)

    return {
        "emotion": emotion,
        "song": song,
        "path": f"music/{emotion}/{song}"
    }


@router.get("/song/{emotion}/{filename}")
def get_song(emotion: str, filename: str):

    file_path = os.path.join(
        MUSIC_DIR,
        emotion,
        filename
    )

    return FileResponse(
        file_path,
        media_type="audio/mpeg"
    )