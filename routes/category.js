const express = require('express');
const router = express.Router();
const { create, list, read, remove, edit } = require('./../controllers/category');

// validators
const { runValidation } = require('../validators');

const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post(
	'/category',
	categoryCreateValidator,
	runValidation,
	requireSignin,
	create
);
router.post('/edit-category',
categoryCreateValidator,
runValidation,
requireSignin,
 edit
 );
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, remove);

module.exports = router;
