// Import required Module
const express = require('express');
const router = express.Router();

// Import user.controller
const ctrlUser = require('../controllers/user.controller');

// Authentication -> email and password match database
router.post('/auth', ctrlUser.authenticate);

// Register user
router.post('/register', ctrlUser.register);


module.exports = router;
