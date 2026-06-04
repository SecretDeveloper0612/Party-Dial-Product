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

// --- 11. Debugging Middleware ---
const allowedOrigins = [
  "https://www.partydial.com",
  "https://partydial.com",
  "https://party-dial-client.vercel.app",
  "https://partner.partydial.com",
  "https://admin.partydial.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowed = !origin || allowedOrigins.includes(origin) || origin.endsWith('partydial.com');
  console.log(`[CORS DEBUG] Method: ${req.method} | Path: ${req.path} | Origin: ${origin || 'none'} | Allowed: ${isAllowed}`);
  next();
});

// --- 1-10. CORS Configuration ---
// Must be placed BEFORE any other middleware or routes (especially rate limiters)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('partydial.com')) {
      return callback(null, true);
    } else {
      console.log(`[CORS BLOCKED] Origin not in allowlist: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle OPTIONS preflight requests properly

// Security Headers (CSP is relaxed to avoid breaking Appwrite/Razorpay)
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false, // Disable for now to ensure Razorpay/Appwrite isn't broken
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Prevent Cloudflare from caching API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Apply rate limiters AFTER CORS so blocked requests still get CORS headers
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/users/login', authLimiter); // if there is a specific login route

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

