@echo off
setlocal
cd /d "%~dp0"

echo Starting Farm2Market at http://localhost:3000
echo Press Ctrl+C to stop the server.
call npm run dev
pause
