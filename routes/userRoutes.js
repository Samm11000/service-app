const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfilePhoto } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddlewares');
const multer = require('multer');

// Using memory storage for file upload to S3
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ All routes require login
router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/upload-photo', upload.single('photo'), uploadProfilePhoto);

module.exports = router;
