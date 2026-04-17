from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Smart AI Trip Planner API")

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart AI Trip Planner API"}

# Placeholder for upcoming routes
from planner import router as planner_router
app.include_router(planner_router, prefix="/backend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)
