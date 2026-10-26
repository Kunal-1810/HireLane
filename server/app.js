require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  (process.env.CLIENT_URL || "").replace(/\/$/, ""),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/hire-?lane[a-z0-9-]*-kunal-f256\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Read JSON and form data from requests (must come before the routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB before handling any request (works locally and on Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    res.status(500).json({ message: 'Database connection failed. Check MONGO_URI and Atlas network access.' });
  }
});

app.get('/', (req, res) => res.json({ message: 'HireLane API is running' }));
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;