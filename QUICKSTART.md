## 🎯 Quick Start - Istruzioni Rapide

### 1️⃣ Installazione Rapida (1 minuto)

**Su Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Su Windows:**
```bash
setup.bat
```

**Manuale:**
```bash
npm install
npm run db:setup
npm run db:seed
npm start
```

### 2️⃣ Accesso

Apri il browser e vai a:

- **🌐 Homepage**: http://localhost:3000
- **🔐 Admin Panel**: http://localhost:3000/admin

### 3️⃣ Credenziali Admin

```
📧 Email: support@homura
🔑 Password: homurasupportstaff
```

---

## 📊 Admin Panel - Guida Rapida

### Dashboard
Visualizza le statistiche in tempo reale:
- Richieste Unban in sospeso
- Richieste Unmute in sospeso
- Segnalazioni in sospeso
- Candidature in sospeso

### Richieste Unban
Gestisci le richieste di sblocco degli utenti:
1. Clicca su "Vedi" per visualizzare i dettagli
2. Aggiungi note admin se necessario
3. Scegli: Approva (✓) o Rifiuta (✗)

### Richieste Unmute
Gestisci le richieste di smutamento:
1. Stessa procedura di Unban
2. Approva o Rifiuta

### Segnalazioni
Gestisci le segnalazioni di utenti:
1. Visualizza reporter e segnalato
2. Leggi il motivo e la descrizione
3. Aggiorna lo status: Revisiona, Risolvi, Archivia

### Candidature
Gestisci le candidature per posizioni staff:
1. Visualizza profilò del candidato
2. Leggi il messaggio di candidatura
3. Approva o Rifiuta (e aggiungi note)

### Comunicazioni
Crea annunci visibili sulla homepage:
1. Clicca "+ Nuova Comunicazione"
2. Compila: Titolo, Contenuto, Tipo, Priorità
3. Clicca "Crea"
4. Saranno visibili sulla homepage

---

## 🔧 Comandi Utili

```bash
# Avvia il server in development (con auto-reload)
npm run dev

# Visualizza il database con interfaccia grafica
npm run db:studio

# Reset completamente il database
npx prisma migrate reset

# Pulisci node_modules e reinstalla
rm -rf node_modules
npm install
```

---

## 🌐 Homepage

La homepage mostra:
- Hero section con call-to-action
- Le feature della community
- Statistiche
- **Sezione Comunicazioni**: mostra tutte le comunicazioni attive create dall'admin
- Footer con link

Le comunicazioni vengono caricate automaticamente dall'API e aggiornate in tempo reale.

---

## 🐛 Problemi Comuni

### ❌ "Port 3000 is already in use"
```bash
# Cambia porta nel .env
PORT=3001
```

### ❌ "Cannot find module '@prisma/client'"
```bash
npm install
```

### ❌ "Database error"
```bash
npx prisma migrate reset
npm run db:seed
```

### ❌ "Admin login non funziona"
- Verifica che il .env contenga le credenziali giuste
- Verifica che il database sia stato seedato: `npm run db:seed`

---

## 📱 Utilizzo da Mobile

L'admin panel è **fully responsive**. Puoi accedere da:
- 📱 Telefono
- 📲 Tablet
- 💻 Desktop

---

## 🔒 Sicurezza

✅ **Implementate:**
- Autenticazione JWT
- Password criptate con bcryptjs
- CORS configurato
- Validazione input
- Solo admin può modificare

⚠️ **In produzione:** 
- Cambia il JWT_SECRET in .env
- Cambia le credenziali admin
- Usa HTTPS
- Configura CORS per domini specifici
- Usa un database robusto (PostgreSQL)

---

## 📤 Deployment

### Su Vercel (consigliato)
```bash
# 1. Inizializza git (già fatto)
# 2. Crea account su vercel.com
# 3. Connetti il repo
# 4. Vercel deploya automaticamente

# Per il database, usa Vercel KV o PlanetScale
```

### Su Heroku
```bash
# 1. Installa Heroku CLI
# 2. Login: heroku login
# 3. Crea app: heroku create
# 4. Push: git push heroku main
# 5. Setup database: heroku run npm run db:setup
```

### Su DigitalOcean/VPS
```bash
# 1. SSH nel server
# 2. Installa Node.js
# 3. Clone il repo
# 4. Configura .env
# 5. npm install
# 6. npm run db:setup
# 7. npm start (o usa PM2)
```

---

## 📚 Documentazione

- **API Completa**: Vedi `API.md`
- **README**: Vedi `README.md`  
- **Questo file**: `QUICKSTART.md`

---

## 💡 Tips & Tricks

1. **Backup database**: Copia il file `prisma/dev.db`
2. **Export dati**: Usa `npm run db:studio` (GUI interattiva)
3. **Auto-reload dev**: Usa `npm run dev` per modifiche live
4. **Monitor server**: Usa Tools come PM2, Forever, o systemd

---

## 🆘 Supporto

Se hai problemi:
1. Leggi il README
2. Controlla la documentazione API
3. Verifica il file `.env`
4. Prova a resettare il database
5. Contatta support@homura

---

**Pronto per iniziare? Digita: `npm start` e buon divertimento! 🚀**
