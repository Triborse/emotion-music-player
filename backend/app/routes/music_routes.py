import os
import random
from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

# Anchor MUSIC_DIR to this file's location, not the process's cwd
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # .../app/routes
MUSIC_DIR = os.path.join(BASE_DIR, "..", "..", "music")  # backend/music        # .../app/music
MUSIC_DIR = os.path.normpath(MUSIC_DIR)

print("Resolved MUSIC_DIR:", MUSIC_DIR)

@router.get("/recommend/{emotion}")
def recommend_song(emotion: str):
    emotion_folder = os.path.join(MUSIC_DIR, emotion)
    print("Looking for:", emotion_folder)

    if not os.path.isdir(emotion_folder):
        return {"error": "Emotion folder not found"}

    songs = [f for f in os.listdir(emotion_folder) if f.endswith(".mp3")]
    if not songs:
        return {"error": "No songs found"}

    song = random.choice(songs)
    return {
        "emotion": emotion,
        "song": song,
        "path": f"music/{emotion}/{song}"
    }


@router.get("/song/{emotion}/{filename}")
def get_song(emotion: str, filename: str):
    file_path = os.path.join(MUSIC_DIR, emotion, filename)
    if not os.path.isfile(file_path):
        return {"error": "Song file not found"}
    return FileResponse(file_path, media_type="audio/mpeg")

@router.get("/playlist/{emotion}")
def get_playlist(emotion: str):
    emotion_folder = os.path.join(MUSIC_DIR, emotion)

    if not os.path.isdir(emotion_folder):
        return {"error": "Emotion folder not found"}

    songs = [f for f in os.listdir(emotion_folder) if f.endswith(".mp3")]

    if not songs:
        return {"error": "No songs found"}

    return {
        "emotion": emotion,
        "songs": songs
    }