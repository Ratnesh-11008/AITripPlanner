#!/bin/bash

# Start backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start frontend
cd ../frontend
npm install
npm run build
npm run preview -- --host 0.0.0.0 --port 3000
