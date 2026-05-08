const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

connectDB();

const configuredOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.VERCEL_URL) {
  configuredOrigins.push(`https://${process.env.VERCEL_URL}`);
}

const allowedOrigins = [...new Set(configuredOrigins)];
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS !== 'false';

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const isAllowedPreview =
        allowVercelPreviews && origin && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

      if (!origin || allowedOrigins.includes(origin) || isAllowedPreview) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Library Management System API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;