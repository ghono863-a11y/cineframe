@echo off
title CINEFRAME Server
echo ============================================
echo   Starting CINEFRAME server...
echo   Keep this window OPEN while using the site
echo   Close this window to stop the server
echo ============================================
echo.
cd /d "%~dp0"
"C:\Program Files\nodejs\node.exe" server.js
pause
