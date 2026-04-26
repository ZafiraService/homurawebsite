#!/bin/bash

# Homura Community - Setup Script

echo "╔════════════════════════════════════════╗"
echo "║   HOMURA COMMUNITY - SETUP WIZARD      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trovato! Installa Node.js da https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js versione: $(node --version)"
echo "✓ npm versione: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installazione dipendenze..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Errore nell'installazione delle dipendenze!"
    exit 1
fi

echo "✓ Dipendenze installate"
echo ""

# Create database
echo "🗄️  Setup database..."
npm run db:setup

if [ $? -ne 0 ]; then
    echo "❌ Errore nel setup del database!"
    exit 1
fi

echo "✓ Database creato"
echo ""

# Seed database
echo "🌱 Inizializzazione dati..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Errore nell'inizializzazione del database!"
    exit 1
fi

echo "✓ Dati iniziali caricati"
echo ""

echo "╔════════════════════════════════════════╗"
echo "║   ✅ SETUP COMPLETATO!                ║"
echo "╠════════════════════════════════════════╣"
echo "║  🚀 Avvia il server con:               ║"
echo "║     npm start                          ║"
echo "║                                        ║"
echo "║  🌐 Homepage: http://localhost:3000   ║"
echo "║  🔐 Admin: http://localhost:3000/admin║"
echo "║                                        ║"
echo "║  👤 Email: support@homura              ║"
echo "║  🔑 Password: homurasupportstaff       ║"
echo "╚════════════════════════════════════════╝"
