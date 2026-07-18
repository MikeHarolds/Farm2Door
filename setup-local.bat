@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo Farm2Market local setup
echo ========================================

echo.
echo Project folder: %CD%
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed or is not in PATH.
  echo Install Node.js 22 LTS or newer, restart Windows, then run this file again.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo npm is not available. Reinstall Node.js 22 LTS or newer.
  pause
  exit /b 1
)

if not exist .env.local copy /Y .env.example .env.local >nul

echo Installing packages from the public npm registry...
call npm install --registry=https://registry.npmjs.org/
if errorlevel 1 goto :failed

echo.
echo Preparing the local SQLite database...
call npm run setup:local
if errorlevel 1 goto :failed

echo.
echo Setup completed successfully.
echo Run start-local.bat to open the portal.
pause
exit /b 0

:failed
echo.
echo Setup failed. Review the error shown above.
echo If this folder is inside OneDrive, move it to C:\Projects\farm2market-local and try again.
pause
exit /b 1
