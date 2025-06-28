const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  getVendorProfile,
  updateVendorProfile,
  uploadVendorImage,
} = require('../controllers/vendorController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// All vendor routes are protected
router.use(verifyToken);

router.get('/profile', getVendorProfile);
router.put('/profile', updateVendorProfile);
router.post('/upload-photo', upload.single('photo'), uploadVendorImage);

module.exports = router;
