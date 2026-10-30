import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import caseRoutes from './src/routes/caseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: true, // Dynamically allows local and Vercel production/preview domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    name: '🕵️ AI Mystery Room Backend API',
    status: 'online',
    health: '/api/health',
    message: 'Backend server is running. Visit your Vercel frontend URL to play the game!'
  });
});

// Health check endpoint (available at both /api/health and /health)
const healthHandler = (req, res) => {
  res.json({
    status: 'online',
    service: 'AI Mystery Room Backend',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key')
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// API Routes mounted on both /api and root / for client flexibility
app.use('/api', caseRoutes);
app.use('/', caseRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: `Endpoint not found: ${req.method} ${req.originalUrl}` 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ServerError]', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error: ' + err.message
  });
});

// Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🕵️ AI Mystery Room Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
}

const isTestMode = process.env.NODE_ENV === 'test' || process.argv.some(arg => arg.includes('test'));
if (!isTestMode) {
  startServer();
}

export default app;
