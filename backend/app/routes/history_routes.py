import os
import pandas as pd
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HISTORY_CSV = os.path.normpath(os.path.join(BASE_DIR, "..", "history.csv"))

COLUMNS = ["timestamp", "emotion", "confidence", "channel", "song"]


def ensure_csv_exists():
    if not os.path.exists(HISTORY_CSV):
        df = pd.DataFrame(columns=COLUMNS)
        df.to_csv(HISTORY_CSV, index=False)


class HistoryEntry(BaseModel):
    emotion: str
    confidence: float
    channel: str
    song: str


@router.post("/history/log")
def log_history(entry: HistoryEntry):
    ensure_csv_exists()

    new_row = {
        "timestamp": datetime.now().isoformat(),
        "emotion": entry.emotion,
        "confidence": entry.confidence,
        "channel": entry.channel,
        "song": entry.song
    }

    df = pd.read_csv(HISTORY_CSV)
    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    df.to_csv(HISTORY_CSV, index=False)

    return {"status": "logged", "entry": new_row}

@router.get("/history")
def get_history():
    ensure_csv_exists()

    df = pd.read_csv(HISTORY_CSV)
    df = df.sort_values(by="timestamp", ascending=False)

    return df.to_dict(orient="records")


@router.delete("/history")
def clear_history():
    df = pd.DataFrame(columns=COLUMNS)
    df.to_csv(HISTORY_CSV, index=False)

    return {"status": "cleared"}

@router.get("/trends")
def get_trends():
    ensure_csv_exists()

    df = pd.read_csv(HISTORY_CSV)

    if df.empty:
        return {
            "labels": [],
            "datasets": [
                {"label": "Happiness Index", "data": [], "borderColor": "#3b82f6", "tension": 0.4},
                {"label": "Sadness Index", "data": [], "borderColor": "#8b5cf6", "tension": 0.4}
            ]
        }

    df = df.sort_values(by="timestamp", ascending=True).tail(7)

    labels = []
    happiness_data = []
    sadness_data = []

    for _, row in df.iterrows():
        ts = pd.to_datetime(row["timestamp"])
        labels.append(ts.strftime("%H:%M"))

        emotion = row["emotion"]
        confidence = float(row["confidence"])

        if emotion == "Happy":
            happiness_data.append(round(confidence * 100))
        elif emotion == "Energetic":
            happiness_data.append(round(confidence * 85))
        elif emotion == "Calm":
            happiness_data.append(round(confidence * 60))
        elif emotion == "Neutral":
            happiness_data.append(round(confidence * 50))
        else:
            happiness_data.append(round(confidence * 20))

        if emotion == "Sad":
            sadness_data.append(round(confidence * 100))
        elif emotion == "Neutral":
            sadness_data.append(round(confidence * 30))
        elif emotion == "Calm":
            sadness_data.append(round(confidence * 20))
        else:
            sadness_data.append(round(confidence * 10))

    return {
        "labels": labels,
        "datasets": [
            {"label": "Happiness Index", "data": happiness_data, "borderColor": "#3b82f6", "tension": 0.4},
            {"label": "Sadness Index", "data": sadness_data, "borderColor": "#8b5cf6", "tension": 0.4}
        ]
    }