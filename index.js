require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const app = express();
const port = 3000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://your-cloudfront-url.cloudfront.net',
    'http://your-s3-website.s3-website-region.amazonaws.com'
  ]
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.get('/', (req, res) => res.send('✅ Service Booking Backend is Live'));

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});

