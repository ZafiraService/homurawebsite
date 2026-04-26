# 📡 Homura API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Tutti gli endpoint admin richiedono un token JWT nell'header:

```
Authorization: Bearer <token>
```

## Endpoints

### 🔐 Autenticazione

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "support@homura",
  "password": "homurasupportstaff"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "support@homura"
  }
}
```

#### Verify Token
```http
GET /auth/verify
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "admin": {
    "id": 1,
    "email": "support@homura"
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logged out"
}
```

---

### 🔓 Richieste Unban

#### Get All Unban Requests
```http
GET /unban
GET /unban?status=pending
GET /unban?status=approved
GET /unban?status=rejected
```

**Response (200):**
```json
[
  {
    "id": 1,
    "discordId": "123456789",
    "username": "player123",
    "reason": "Ban injustement",
    "status": "pending",
    "adminNotes": null,
    "createdAt": "2024-04-26T10:30:00Z",
    "updatedAt": "2024-04-26T10:30:00Z"
  }
]
```

#### Get Single Unban Request
```http
GET /unban/:id
```

**Response (200):** Same as above (single object)

#### Create Unban Request
```http
POST /unban
Content-Type: application/json

{
  "discordId": "123456789",
  "username": "player123",
  "reason": "Ban injustement"
}
```

**Response (201):** Created request object

#### Update Unban Request (Admin)
```http
PATCH /unban/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "adminNotes": "Approvato dopo revisione"
}
```

**Valid statuses:** `pending`, `approved`, `rejected`

**Response (200):** Updated request object

#### Delete Unban Request (Admin)
```http
DELETE /unban/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Deleted successfully"
}
```

---

### 🔊 Richieste Unmute

Same endpoints as Unban (`/unmute`)

---

### 🚨 Segnalazioni

#### Get All Reports
```http
GET /reports
GET /reports?status=pending
GET /reports?status=in_review
GET /reports?status=resolved
GET /reports?status=dismissed
```

**Response (200):**
```json
[
  {
    "id": 1,
    "reporterDiscordId": "111111111",
    "reporterUsername": "reporter123",
    "reportedDiscordId": "222222222",
    "reportedUsername": "reported456",
    "reason": "Spam",
    "description": "L'utente spamma messaggi",
    "status": "pending",
    "adminNotes": null,
    "createdAt": "2024-04-26T10:30:00Z",
    "updatedAt": "2024-04-26T10:30:00Z"
  }
]
```

#### Get Single Report
```http
GET /reports/:id
```

#### Create Report
```http
POST /reports
Content-Type: application/json

{
  "reporterDiscordId": "111111111",
  "reporterUsername": "reporter123",
  "reportedDiscordId": "222222222",
  "reportedUsername": "reported456",
  "reason": "Spam",
  "description": "L'utente spamma messaggi"
}
```

#### Update Report (Admin)
```http
PATCH /reports/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_review",
  "adminNotes": "In corso di revisione"
}
```

**Valid statuses:** `pending`, `in_review`, `resolved`, `dismissed`

#### Delete Report (Admin)
```http
DELETE /reports/:id
Authorization: Bearer <token>
```

---

### 📋 Candidature

#### Get All Candidatures
```http
GET /candidature
GET /candidature?status=pending
GET /candidature?status=approved
GET /candidature?status=rejected
```

**Response (200):**
```json
[
  {
    "id": 1,
    "discordId": "123456789",
    "username": "aspirant123",
    "email": "aspirant@example.com",
    "position": "moderator",
    "message": "Mi piacerebbe moderare il server...",
    "status": "pending",
    "adminNotes": null,
    "createdAt": "2024-04-26T10:30:00Z",
    "updatedAt": "2024-04-26T10:30:00Z"
  }
]
```

#### Get Single Candidature
```http
GET /candidature/:id
```

#### Create Candidature
```http
POST /candidature
Content-Type: application/json

{
  "discordId": "123456789",
  "username": "aspirant123",
  "email": "aspirant@example.com",
  "position": "moderator",
  "message": "Mi piacerebbe moderare il server..."
}
```

**Valid positions:** `moderator`, `helper`, `staff`

#### Update Candidature (Admin)
```http
PATCH /candidature/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "adminNotes": "Approvato - benvenuto nel team!"
}
```

**Valid statuses:** `pending`, `approved`, `rejected`

#### Delete Candidature (Admin)
```http
DELETE /candidature/:id
Authorization: Bearer <token>
```

---

### 📢 Comunicazioni

#### Get Active Communications (Public)
```http
GET /communication
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Benvenuti in Homura!",
    "content": "Benvenuti nella community...",
    "type": "announcement",
    "isActive": true,
    "priority": 1,
    "createdAt": "2024-04-26T10:30:00Z",
    "updatedAt": "2024-04-26T10:30:00Z"
  }
]
```

#### Get All Communications (Admin)
```http
GET /communication/admin/all
Authorization: Bearer <token>
```

#### Get Single Communication
```http
GET /communication/:id
```

#### Create Communication (Admin)
```http
POST /communication
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nuovo Evento",
  "content": "Annuncio del nuovo evento...",
  "type": "announcement",
  "priority": 0
}
```

**Valid types:** `announcement`, `update`, `warning`, `event`
**Priority:** 0 = normale, 1 = alta

**Response (201):** Created communication object

#### Update Communication (Admin)
```http
PATCH /communication/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Titolo aggiornato",
  "content": "Contenuto aggiornato",
  "type": "update",
  "isActive": true,
  "priority": 1
}
```

**Response (200):** Updated communication object

#### Delete Communication (Admin)
```http
DELETE /communication/:id
Authorization: Bearer <token>
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

## Error Responses

```json
{
  "error": "Error message description"
}
```

## Rate Limits

Nessun rate limit configurato al momento.

## CORS

CORS è abilitato per tutte le origini. In produzione, configurare CORS appropriatamente.

## Esempi di Utilizzo

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"support@homura","password":"homurasupportstaff"}'

# Get unban requests
curl http://localhost:3000/api/unban

# Update unban request
curl -X PATCH http://localhost:3000/api/unban/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","adminNotes":"Done"}'
```

### JavaScript/Fetch

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'support@homura',
    password: 'homurasupportstaff'
  })
});

const data = await response.json();
const token = data.token;

// Get requests
const requests = await fetch('/api/unban');
const allRequests = await requests.json();

// Create request
const newRequest = await fetch('/api/unban', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    discordId: '123456789',
    username: 'player123',
    reason: 'Ban error'
  })
});
```

---

**Ultima modifica:** 26 Aprile 2024
