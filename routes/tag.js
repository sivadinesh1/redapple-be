const express = require('express');
const router = express.Router();
const { create, list, read, remove, edit } = require('../controllers/tag');

// validators
const { runValidation } = require('../validators');

const { tagCreateValidator } = require('../validators/tag');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/tag', tagCreateValidator, runValidation, requireSignin, create);
router.post('/edit-tag', tagCreateValidator, runValidation, requireSignin, edit);
router.get('/tags/:companyid', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', requireSignin, remove);

module.exports = router;
