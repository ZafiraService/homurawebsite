import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Routes
import authRoutes from './routes/auth.js';
import unbanRoutes from './routes/unban.js';
import unmuteRoutes from './routes/unmute.js';
import reportRoutes from './routes/reports.js';
import candidatureRoutes from './routes/candidature.js';
import communicationRoutes from './routes/communication.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/unban', unbanRoutes);
app.use('/api/unmute', unmuteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/candidature', candidatureRoutes);
app.use('/api/communication', communicationRoutes);

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/index.html'));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/index.html'));
});

// Serve public homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running ✓' });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   HOMURA COMMUNITY SERVER STARTED      ║
╠════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}           
║  📍 Homepage: http://localhost:${PORT}
║  🔐 Admin Panel: http://localhost:${PORT}/admin
║  📊 Health check: http://localhost:${PORT}/health
╚════════════════════════════════════════╝
  `);
});
