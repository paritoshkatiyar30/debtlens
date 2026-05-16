const express = require('express');
const router = express.Router();
const { calculateSalary } = require('../controllers/salaryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/calculate', protect, calculateSalary);

module.exports = router;