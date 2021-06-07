const express = require('express');
const router = express.Router();
const { create, list, read, remove, edit } = require('../controllers/company');

// validators
const { runValidation } = require('../validators');

const { companyCreateValidator } = require('../validators/company');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/company', companyCreateValidator, runValidation, requireSignin, create);
router.put('/update', companyCreateValidator, runValidation, requireSignin, edit);
router.get('/companys', list);
router.get('/company/:id', read);
router.delete('/company/:id', requireSignin, remove);

module.exports = router;
