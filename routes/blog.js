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
	createMeeting,
	latestBlog,
	tagFilter,
	categoryFilter
} = require('../controllers/blog');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/blog', requireSignin, create);
router.post('/meetingCreate', requireSignin, createMeeting);
router.get('/blogs/:companyId', list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:id', read);
router.delete('/blog/:slug', requireSignin, remove);
router.put('/blog/:id', requireSignin, update);

router.get('/blog/photo/:slug', photo);
router.post('/blogs/related', listRelated);
router.get('/blogs/getLatest', latestBlog);
router.get('/blogs/searchTag/:searchKey', tagFilter);
router.get('/blogs/searchCat/:searchKey', categoryFilter);



module.exports = router;
