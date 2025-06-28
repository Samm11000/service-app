const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  createBooking,
  getUserBookings,
  getVendorBookings,
} = require('../controllers/bookingController');

router.use(verifyToken);

router.post('/', createBooking);
router.get('/user', getUserBookings);
router.get('/vendor', getVendorBookings);

module.exports = router;
