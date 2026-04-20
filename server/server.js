require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

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

// Routes
const allowedOrigins = [
  'https://partner.partydial.com',
  'https://admin.partydial.com',
  'https://partydial.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://192.168.1.4:3003',
  'http://192.168.1.4:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('partydial.com')) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(null, true); // Temporarily allow all in production to debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

