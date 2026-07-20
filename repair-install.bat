@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo Farm2Market dependency repair
 echo ========================================

echo Closing any Node.js processes that may be locking files...
taskkill /F /IM node.exe >nul 2>&1

echo Removing incomplete installation folders...
if exist .next rmdir /S /Q .next
if exist node_modules rmdir /S /Q node_modules

if exist node_modules (
  echo.
  echo Windows could not remove node_modules because files are locked.
  echo Close VS Code, Command Prompt, File Explorer previews, and OneDrive sync.
  echo Better: move this project to C:\Projects\farm2market-local and run this file again.
  pause
  exit /b 1
)

echo Clearing the npm cache verification state...
call npm cache verify

echo Installing from the public npm registry...
call npm install --registry=https://registry.npmjs.org/
if errorlevel 1 goto :failed

echo Preparing the PostgreSQL database (requires DATABASE_URL in .env.local)...
call npm run setup:local
if errorlevel 1 goto :failed

echo.
echo Repair completed successfully.
echo Run start-local.bat next.
pause
exit /b 0

:failed
echo.
echo Repair failed. Check your internet connection and any proxy or firewall settings.
pause
exit /b 1
