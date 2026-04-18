# Smart AI Trip Planner

This project contains a full-stack application with a FastAPI backend and a React/Vite frontend.

## Deployment on Render

Follow these steps to deploy this application to Render.

### 1. Backend on Render

Deploy the backend as a **Web Service**:

* **Create New Web Service** on Render and connect your repository.
* **Root directory**: `backend`
* **Build command**: `pip install -r requirements.txt`
* **Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
* **Environment Variables**:
  * `GROQ_API_KEY`: Your Groq API key
  * `FRONTEND_URL`: (Optional initially, update this after frontend is deployed e.g., `https://your-frontend.onrender.com`)

Once deployed, copy the backend's public URL (e.g., `https://your-backend.onrender.com`).

### 2. Frontend on Render

Deploy the frontend as a **Static Site**:

* **Create New Static Site** on Render and connect your repository.
* **Root directory**: `frontend`
* **Build command**: `npm install && npm run build`
* **Publish directory**: `dist`
* **Environment Variables**:
  * `VITE_API_URL`: Use the backend URL you copied earlier without trailing slashes (e.g., `https://your-backend.onrender.com`). *Important: After the backend is deployed, its public URL should be used as `VITE_API_URL` here in the frontend.*

### Post-Deployment

After both are deployed, make sure to update the `FRONTEND_URL` environment variable in your Backend Web Service on Render with your deployed frontend URL so that CORS policies allow the requests.
