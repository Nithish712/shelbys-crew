const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const menuRoutes = require('./src/routes/menuItems');
const comboRoutes = require('./src/routes/combos');
const quoteRoutes = require('./src/routes/quotes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle OPTIONS preflight for all routes
app.options('*', cors());

app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok', shop: "Shelby's Crew" }));
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/combos', comboRoutes);
app.use('/api/quotes', quoteRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`🎩 Shelby's Crew API running on http://localhost:${PORT}`);
});
