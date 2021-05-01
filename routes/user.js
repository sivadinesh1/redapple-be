const express = require('express');
const router = express.Router();
const { requireSignin, authMiddleware, adminMiddleware } = require('../controllers/auth');
const { read } = require('../controllers/user');
const { create } = require('../controllers/userApi');


router.get('/profile', requireSignin, authMiddleware, read);
router.post('/user', create);


module.exports = router;