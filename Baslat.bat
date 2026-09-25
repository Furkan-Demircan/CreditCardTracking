@echo off
title KartTaksit Pro
cd /d "%~dp0"

echo ==========================================
echo    KartTaksit Pro Baslatiliyor...
echo ==========================================

:: Eger sunucu zaten aciksa tekrar baslatmayi engellemek icin port kontrolu veya direkt calistirma
start /min cmd /c "npm run dev"

:: Sunucunun hazir olmasi icin kisa bekleme
timeout /t 2 /nobreak >nul

:: Windows Edge ile masaustu uygulama modunda acmayi dene (pencere seklinde), olmazsa varsayilan tarayicida ac
start msedge --app=http://localhost:5173 2>nul || start http://localhost:5173

exit
