@echo off
title Echoes of Genesis - Dev Server
echo ===================================================
echo   KHOI DONG ECHOES OF GENESIS (ASTRAEA ONLINE)
echo ===================================================
echo 1. Dang kiem tra va cai dat dependencies...
call npm install
echo.
echo 2. Dang tai assets do hoa tu GitHub Flare Game (Tilesets, Icons, Enemies)...
call node scripts/download-flare-assets.mjs
echo.
echo 3. Dang khoi dong Web Client (Port 3000) va Game Server (Port 2567)...
echo.
call npm run dev
pause

