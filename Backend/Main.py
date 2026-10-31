import os
from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from Controllers.Outer_Coordinates import (
    Outer_Coordinates_Controller
)
from Types.BasePlan import BasePlan
from Utils.rate_limiter import check_rate_limit
load_dotenv()

app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/outer_coordinates")
async def generate_floor_plan(plan: BasePlan):

    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is not configured"
        )
    
    await check_rate_limit(plan.userId)

    return await Outer_Coordinates_Controller(
        plan,
        GEMINI_API_KEY
    )