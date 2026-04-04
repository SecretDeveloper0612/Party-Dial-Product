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
const configController = require('./controllers/configController');

const app = express();
const PORT = process.env.PORT || 5005;

// Routes
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to PartyDial API - Powered by Appwrite" });
});

// Appwrite APIs
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/venues', venueRoutes);
app.get('/api/config', configController.getPublicConfig);

// Optional: Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

