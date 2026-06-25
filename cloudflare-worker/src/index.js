import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/authRoutes'
import venueRoutes from './routes/venueRoutes'
import leadRoutes from './routes/leadRoutes'
import paymentRoutes from './routes/paymentRoutes'
import userRoutes from './routes/userRoutes'
import planRoutes from './routes/planRoutes'
import couponRoutes from './routes/couponRoutes'
import dataRoutes from './routes/dataRoutes'
import aiRoutes from './routes/aiRoutes'
import accessRoutes from './routes/accessRoutes'
import quotationRoutes from './routes/quotationRoutes'
import configRoutes from './routes/configRoutes'

const app = new Hono()

// Apply CORS dynamically based on allowed origins from Env
app.use('/*', async (c, next) => {
  const allowedOriginsStr = c.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsStr.split(',').map(o => o.trim());
  
  const corsMiddleware = cors({
    origin: (origin) => {
      // Allow requests with no origin (mobile) or if it's in the allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        return origin;
      }
      return null;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    credentials: true,
  })
  
  return corsMiddleware(c, next)
})

app.get('/', (c) => {
  return c.json({ message: 'Welcome to PartyDial API - Powered by Cloudflare Workers & Hono' })
})

// Setup routes mapping
app.route('/api/auth', authRoutes)
app.route('/api/venues', venueRoutes)
app.route('/api/leads', leadRoutes)
app.route('/api/payments', paymentRoutes)
app.route('/api/users', userRoutes)
app.route('/api/plans', planRoutes)
app.route('/api/coupons', couponRoutes)
app.route('/api/data', dataRoutes)
app.route('/api/ai', aiRoutes)
app.route('/api/access', accessRoutes)
app.route('/api/quotations', quotationRoutes)
app.route('/api/config', configRoutes)

import { sendPasswordResetEmail } from './utils/emailService';

app.get('/api/test-email', async (c) => {
  try {
    await sendPasswordResetEmail(c.env, 'admin@partydial.com', 'http://test.com');
    return c.json({ status: 'success' });
  } catch (err) {
    return c.json({ status: 'error', message: err.message, stack: err.stack }, 500);
  }
});

export default app
