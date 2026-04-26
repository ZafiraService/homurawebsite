@echo off
REM Homura Community - Setup Script for Windows

echo.
echo ╔════════════════════════════════════════╗
echo ║   HOMURA COMMUNITY - SETUP WIZARD      ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js non trovato! Installa Node.js da https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js versione:
node --version
echo ✓ npm versione:
npm --version
echo.

REM Install dependencies
echo 📦 Installazione dipendenze...
call npm install

if errorlevel 1 (
    echo ❌ Errore nell'installazione delle dipendenze!
    pause
    exit /b 1
)

echo ✓ Dipendenze installate
echo.

REM Create database
echo 🗄️  Setup database...
call npm run db:setup

if errorlevel 1 (
    echo ❌ Errore nel setup del database!
    pause
    exit /b 1
)

echo ✓ Database creato
echo.

REM Seed database
echo 🌱 Inizializzazione dati...
call npm run db:seed

if errorlevel 1 (
    echo ❌ Errore nell'inizializzazione del database!
    pause
    exit /b 1
)

echo ✓ Dati iniziali caricati
echo.

echo ╔════════════════════════════════════════╗
echo ║   ✅ SETUP COMPLETATO!                ║
echo ╠════════════════════════════════════════╣
echo ║  🚀 Avvia il server con:               ║
echo ║     npm start                          ║
echo ║                                        ║
echo ║  🌐 Homepage: http://localhost:3000   ║
echo ║  🔐 Admin: http://localhost:3000/admin║
echo ║                                        ║
echo ║  👤 Email: support@homura              ║
echo ║  🔑 Password: homurasupportstaff       ║
echo ╚════════════════════════════════════════╝
echo.
pause
