@echo off
echo ===================================================
echo Welcome to Smart AI Trip Planner
echo ===================================================
echo.

:: Check if node_modules exists, if not run npm install
IF NOT EXIST "node_modules\" (
    echo Installing root dependencies (concurrently)...
    call npm install
)

echo Starting Full Stack Application...
echo.
echo ===================================================
echo Backend API will be available at: http://localhost:8000
echo Frontend GUI will be available at: http://localhost:3000
echo ===================================================
echo.

call npm start
pause
