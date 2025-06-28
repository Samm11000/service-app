const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.send({ message: 'Auth route working!' });
});

module.exports = router;
