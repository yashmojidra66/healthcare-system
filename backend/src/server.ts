import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db';
import { errorHandler, notFound } from './middleware/error.middleware';

// Routes
import authRoutes        from './routes/auth.routes';
import healthRoutes      from './routes/health.routes';
import appointmentRoutes from './routes/appointments.routes';
import doctorRoutes      from './routes/doctors.routes';
import mealPlanRoutes    from './routes/mealplans.routes';
import workoutRoutes     from './routes/workouts.routes';
import blogRoutes        from './routes/blog.routes';
import communityRoutes   from './routes/community.routes';
import adminRoutes       from './routes/admin.routes';

const app = express();

// ── Security & Parsing ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Stricter limit on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});
app.use('/api/auth', authLimiter);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'HealthCare+ API is running', timestamp: new Date() });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/health-logs', healthRoutes);
app.use('/api/appointments',appointmentRoutes);
app.use('/api/doctors',     doctorRoutes);
app.use('/api/meal-plans',  mealPlanRoutes);
app.use('/api/workouts',    workoutRoutes);
app.use('/api/blog',        blogRoutes);
app.use('/api/community',   communityRoutes);
app.use('/api/admin',       adminRoutes);

// ── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});

export default app;
