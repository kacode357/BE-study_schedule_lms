require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { connectDB } = require('./config/db');
const routes = require('./routes');
const ApiResponse = require('./responses/apiResponse');
const MESSAGES = require('./constants/messages');

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://istudy.quangde.cloud',
];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (ví dụ: Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin "${origin}" không được phép`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// ─────────────────────────────────────────────────────────────────────────────

app.use(express.json());
app.use('/api', routes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Study Schedule LMS - API Docs',
  swaggerOptions: { persistAuthorization: true },
}));

app.get('/', (req, res) => {
  res.send('Study Schedule LMS API is running!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(ApiResponse.errorSingle(MESSAGES.SYSTEM.INTERNAL_ERROR));
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
  } catch (error) {
    console.error('❌ Kết nối MongoDB thất bại:', error.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại port ${PORT}`);
  });
}

startServer();
