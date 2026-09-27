@echo off
setlocal
cd /d "%~dp0"

if not exist "dist\index.html" (
  echo Building prototype...
  call npm.cmd run build
  if errorlevel 1 exit /b 1
)

start "Tactile prototype server" /min python -m http.server 4173 --bind 127.0.0.1 --directory dist
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173/"

echo Prototype opened at http://127.0.0.1:4173/
echo Close the minimized server window after viewing.
endlocal
