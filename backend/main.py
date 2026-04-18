import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Smart AI Trip Planner API")

# Configure CORS for the React frontend
frontend_url = os.environ.get("FRONTEND_URL", "")
allow_origins = [frontend_url] if frontend_url else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart AI Trip Planner API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Placeholder for upcoming routes
from planner import router as planner_router
app.include_router(planner_router, prefix="/backend")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
