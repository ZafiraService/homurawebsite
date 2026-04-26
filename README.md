# 🎉 Homura Community - Website & Admin Panel

Sito web completo per la community Discord Homura con admin panel per gestire richieste, segnalazioni e comunicazioni.

## ✨ Features

✅ **Sito Web Pubblico**
- Homepage accattivante con hero section
- Sezione Features e Stats
- Sezione Comunicazioni dinamica (caricata da API)
- Footer con link utili
- Design responsive e moderno

✅ **Admin Panel Completo**
- Login sicuro (email: support@homura, password: homurasupportstaff)
- Dashboard con statistiche in tempo reale
- Gestione Richieste Unban
- Gestione Richieste Unmute
- Gestione Segnalazioni
- Gestione Richieste Candidature
- Gestione Comunicazioni (visibili sulla homepage)

✅ **Backend robusto**
- Express.js con API RESTful
- Prisma ORM con database SQLite
- Autenticazione JWT
- CORS abilitato

## 📋 Requisiti

- Node.js v16+ 
- npm 7+
- SQLite (incluso con Prisma)

## 🚀 Installazione

### 1. Clona il repository

```bash
cd /workspaces/homurawebsite
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Setup del database

```bash
# Crea e configura il database
npm run db:setup

# Popola il database con dati iniziali
npm run db:seed
```

### 4. Avvia il server

```bash
npm start
```

Per lo sviluppo con auto-reload:
```bash
npm run dev
```

## 🌐 Accedi al sito

- **Homepage**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Health**: http://localhost:3000/health

## 👤 Credenziali Admin

```
Email: support@homura
Password: homurasupportstaff
```

## 📡 Endpoints API

### Autenticazione
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verifica token
- `POST /api/auth/logout` - Logout

### Richieste Unban
- `GET /api/unban` - Lista richieste
- `GET /api/unban/:id` - Dettagli richiesta
- `POST /api/unban` - Crea richiesta (pubblico)
- `PATCH /api/unban/:id` - Aggiorna status (admin)
- `DELETE /api/unban/:id` - Elimina richiesta (admin)

### Richieste Unmute
- `GET /api/unmute` - Lista richieste
- `GET /api/unmute/:id` - Dettagli richiesta
- `POST /api/unmute` - Crea richiesta (pubblico)
- `PATCH /api/unmute/:id` - Aggiorna status (admin)
- `DELETE /api/unmute/:id` - Elimina richiesta (admin)

### Segnalazioni
- `GET /api/reports` - Lista segnalazioni
- `GET /api/reports/:id` - Dettagli segnalazione
- `POST /api/reports` - Crea segnalazione (pubblico)
- `PATCH /api/reports/:id` - Aggiorna status (admin)
- `DELETE /api/reports/:id` - Elimina segnalazione (admin)

### Candidature
- `GET /api/candidature` - Lista candidature
- `GET /api/candidature/:id` - Dettagli candidatura
- `POST /api/candidature` - Crea candidatura (pubblico)
- `PATCH /api/candidature/:id` - Aggiorna status (admin)
- `DELETE /api/candidature/:id` - Elimina candidatura (admin)

### Comunicazioni
- `GET /api/communication` - Lista comunicazioni attive (pubblico)
- `GET /api/communication/admin/all` - Tutte le comunicazioni (admin)
- `GET /api/communication/:id` - Dettagli comunicazione
- `POST /api/communication` - Crea comunicazione (admin)
- `PATCH /api/communication/:id` - Modifica comunicazione (admin)
- `DELETE /api/communication/:id` - Elimina comunicazione (admin)

## 📁 Struttura Progetto

```
homurawebsite/
├── server.js                 # Express server principale
├── package.json              # Dipendenze
├── .env                       # Variabili d'ambiente
├── prisma/
│   ├── schema.prisma         # Schema database
│   ├── seed.js               # Script seed
│   └── dev.db                # Database SQLite
├── routes/
│   ├── auth.js               # Autenticazione
│   ├── unban.js              # Unban requests
│   ├── unmute.js             # Unmute requests
│   ├── reports.js            # Segnalazioni
│   ├── candidature.js        # Candidature
│   └── communication.js       # Comunicazioni
└── public/
    ├── index.html            # Homepage
    └── admin/
        ├── index.html        # Admin panel UI
        └── admin-panel.js    # Admin panel logica
```

## 🔒 Sicurezza

- Password criptate con bcryptjs
- Token JWT per l'autenticazione
- CORS configurato
- Validazione input su tutti gli endpoint
- Solo admin può modificare dati

## 🗄️ Database

Il database utilizza SQLite (locale) con Prisma ORM. Contiene le seguenti tabelle:

- `admins` - Utenti admin
- `unban_requests` - Richieste di sblocco
- `unmute_requests` - Richieste di smutamento
- `report_requests` - Segnalazioni utenti
- `candidature_requests` - Candidature staff
- `communications` - Comunicazioni pubbliche

## 🧹 Comandi Utili

```bash
# Visualizza il database con GUI
npm run db:studio

# Crea una nuova migrazione
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## 🌍 Deployment

Per deployare il progetto su un server:

1. Configura le variabili d'ambiente in `.env`
2. Assicurati che Node.js sia installato
3. Installa le dipendenze: `npm install`
4. Setup database: `npm run db:setup`
5. Avvia con `npm start`

### Variabili d'ambiente consigliate per produzione:

```
DATABASE_URL="file:./prisma/prod.db"
JWT_SECRET="your-secure-secret-key"
ADMIN_EMAIL="support@homura"
ADMIN_PASSWORD="your-secure-password"
PORT=3000
NODE_ENV="production"
```

## 📝 Note

- Il database SQLite è locale nella cartella `prisma/`
- Per dati reali in produzione, considera di migrare a PostgreSQL
- Il frontend è completamente client-side (no framework)
- Tutte le comunicazioni sono visibili sulla homepage

## 🐛 Troubleshooting

**Errore di porta in uso:**
```bash
# Cambia la porta nel .env
PORT=3001
```

**Database corrotto:**
```bash
# Reset e ricrea il database
npx prisma migrate reset
npm run db:seed
```

**Errori CORS:**
- Verifica che il frontend acceda a `http://localhost:3000/api`
- In produzione, configura CORS correttamente

## 📞 Support

Per supporto, contatta support@homura

## 📄 Licenza

MIT License

---

**Fatto con ❤️ per la community Homura**
