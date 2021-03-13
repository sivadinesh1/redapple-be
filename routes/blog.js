// const express = require('express');
// const router = express.Router();
// const { create } = require('../controllers/blog');

// const { requireSignin, adminMiddleware } = require('../controllers/auth');

// router.post('/blog', requireSignin, create);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
	create,
	list,
	listAllBlogsCategoriesTags,
	read,
	remove,
	update,
	photo,
	listRelated,
} = require('../controllers/blog');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/blog', requireSignin, create);
router.get('/blogs', list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:id', read);
router.delete('/blog/:slug', requireSignin, remove);
router.put('/blog/:id', requireSignin, update);

router.get('/blog/photo/:slug', photo);
router.post('/blogs/related', listRelated);

module.exports = router;
