@echo off
title Clone 99.99% Flare Game & Flare Engine
echo =================================================================
echo   DANG CLONE FLARE-GAME VA FLARE-ENGINE VE THU MUC DU AN
echo =================================================================
echo.

echo 1. Dang clone flare-game (Assets, Maps, Items, Powers, Monsters)...
if not exist "flare-game-source" (
    git clone --depth 1 https://github.com/flareteam/flare-game.git flare-game-source
) else (
    echo    Thu muc flare-game-source da ton tai.
)

echo.
echo 2. Dang clone flare-engine (C++ Engine Source Code, Isometric Math)...
if not exist "flare-engine-source" (
    git clone --depth 1 https://github.com/flareteam/flare-engine.git flare-engine-source
) else (
    echo    Thu muc flare-engine-source da ton tai.
)

echo.
echo 3. Dang dong bo toan bo Assets Flare vao Web Client (client/public/assets/flare)...
if not exist "client\public\assets\flare" (
    mkdir "client\public\assets\flare"
)

if exist "flare-game-source\mods\fantasycore" (
    xcopy /E /I /Y "flare-game-source\mods\fantasycore" "client\public\assets\flare\fantasycore" > nul
    echo    Da dong bo fantasycore thanh cong!
)

if exist "flare-game-source\mods\empyrean_campaign" (
    xcopy /E /I /Y "flare-game-source\mods\empyrean_campaign" "client\public\assets\flare\empyrean_campaign" > nul
    echo    Da dong bo empyrean_campaign thanh cong!
)

echo.
echo =================================================================
echo   HOAN TAT 100%! TOAN BO ASSETS VA CODE DA SAN SANG DE SU DUNG!
echo =================================================================
pause
