@echo off
echo ========================================
echo NovaLanding CMS - Quick Start
echo ========================================
echo.

cd NovaLanding

echo [1/3] Restoring NuGet packages...
dotnet restore
if %errorlevel% neq 0 (
    echo Failed to restore packages!
    pause
    exit /b %errorlevel%
)
echo.

echo [2/3] Building project...
dotnet build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)
echo.

echo [3/3] Starting application...
echo.
echo ========================================
echo Application will start at:
echo https://localhost:5001
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

dotnet run

pause
