@echo off
setlocal
cd /d "%~dp0frontend"
if not exist node_modules if not exist ..\node_modules (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 goto :error
)
echo Starting PathFinders at http://localhost:3000
start "PathFinders" /D "%~dp0frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
start "" http://localhost:3000
exit /b 0
:error
echo Dependency installation failed. Check Node.js and npm, then try again.
pause
exit /b 1

