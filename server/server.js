require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Import essential routes
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const venueRoutes = require('./routes/venueRoutes');
const aiRoutes = require('./routes/aiRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const leadRoutes = require('./routes/leadRoutes');
const planRoutes = require('./routes/planRoutes');
const couponRoutes = require('./routes/couponRoutes');
const accessRoutes = require('./routes/accessRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const configController = require('./controllers/configController');
const { automateLeadStatus, automatePaymentReminders, automateProfileReminders, automateGSheetSync } = require('./utils/cronJobs');
const { fixAppwriteSchema } = require('./utils/schemaFix');

// Run schema verification on startup
fixAppwriteSchema().catch(err => console.error('Schema fix failed:', err.message));

// Initialize Cron Jobs
automateLeadStatus();
// automatePaymentReminders();
// automateProfileReminders();
automateGSheetSync();

const app = express();
const PORT = process.env.PORT || 5005;

// Trust proxy for Cloudflare
app.set('trust proxy', 1);

// Security Headers (CSP is relaxed to avoid breaking Appwrite/Razorpay)
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false, // Disable for now to ensure Razorpay/Appwrite isn't broken
}));

// Prevent Cloudflare from caching API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Apply rate limiters
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/users/login', authLimiter); // if there is a specific login route

// Routes
app.use(cors({
  origin: [
    "https://www.partydial.com",
    "https://partydial.com",
    "https://party-dial-client.vercel.app",
    "https://partner.partydial.com",
    "https://admin.partydial.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to PartyDial API - Powered by Appwrite" });
});

// Appwrite APIs
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/quotations', quotationRoutes);
app.get('/api/config', configController.getPublicConfig);

// Optional: Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Only listen locally, otherwise export for Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

