const formidable = require('formidable');
const slugify = require('slugify');
const { stripHtml } = require('string-strip-html');

const { errorHandler } = require('../helpers/dbErrorHandler');
const db = require('../helpers/db');

const { smartTrim } = require('../helpers/utils');

const fs = require('fs');

exports.create = (req, res) => {
	console.log("test request------------>",req.body)
	debugger
	let form = new formidable.IncomingForm();

	console.log('dinesh ' + JSON.stringify(form));

	var fileNames = [];
	form.keepExtensions = true;
	// form.uploadDir = "./upload";

	// form.on("fileBegin", function (name, file) {
	//     //rename the incoming file to the file's name
	//     file.path = form.uploadDir + "/" + file.name;
	// })

	form.on('file', function (field, file) {
		fileNames.push(file.name);
		//On file received
	});

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: 'Image could not upload',
			});
		}

		const { title, categories, tags, body } = fields;
		//let body='<h1>test</h1><p>test msbsndsbbsmsbsbsssds.</p><p>sjsjshscjscsjhcshcsccjc</p>'
		console.log('title dinesh ' + title);
		console.log('body dinesh ' + body);
		console.log('categories dinesh ' + categories);
		console.log('tags dinesh ' + tags);

		let arrayOfCategories = categories && categories.split(',');
		let arrayOfTags = tags && tags.split(',');

		console.log('categoriesArr dinesh ' + arrayOfCategories);
		console.log('tagsArr dinesh ' + arrayOfTags);

		let slug = slugify(title).toLowerCase();
		let mtitle = `${title} | ${process.env.APP_NAME}`;

		let mdesc = stripHtml(body).result.substring(0, 160);

		console.log('mdesc dinesh ' + mdesc);
		console.log('mtitle test ' + mtitle);

		let excerpt = smartTrim(body, 320, '', ' ...');
		console.log('excerpt test ' + excerpt);	
		// let postedBy = req.user.id;
		// let photodata;
		// let photoContentType;

		// if (files.photo) {
		// 	if (files.photo.size > 10000000) {
		// 		return res.status(400).json({
		// 			error: 'Image should be less then 1mb in size',
		// 		});
		// 	}
		// 	photodata = fs.readFileSync(files.photo.path);
		// 	console.log('photo data ' + photodata);
		// 	photoContentType = files.photo.type;

		// 	fs.writeFile('./upload1', photodata, function (err) {
		// 		if (err) console.log(err);
		// 		//  return res.send("Successfully uploaded")
		// 	});
		// }

		db.one(
			'INSERT INTO blog(title, slug, body, excerpt, mtitle, mdesc, categories, tags) VALUES($1, $2, $3, $4, $5, $6, $7::integer[], $8::integer[]) RETURNING id',
			[title, slug, body, excerpt, mtitle, mdesc, arrayOfCategories, arrayOfTags]
		)
			.then((data) => {
				console.log('new inserted BLOG id: ' + data.id); // print new user id;
				res.json({ title: title, message: 'success' });
			})
			.catch((error) => {
				console.log('object.. error ' + JSON.stringify(error));
				return res.status(400).json({
					error: errorHandler(error),
				});
			});
	});
};

exports.list = (req, res) => {
	let query = `
	SELECT b.id, b.title, b.excerpt, array_agg(distinct(c.name)) as categories, 	
	array_agg(distinct(t.name)) as tags
	 FROM blog b
	 	LEFT outer JOIN categories as c ON c.id = SOME(b.categories)
	 	LEFT  JOIN tags as t ON t.id = SOME(b.tags)
	 GROUP BY title, b.id ORDER BY id `;

	db.any(query, [])
		.then((data) => {
			return res.json(data);
		})
		.catch((error) => {
			console.log('error ...' + error);
		});
};

exports.listAllBlogsCategoriesTags = (req, res) => {
	let limit = req.body.limit ? parseInt(req.body.limit) : 10;
	let skip = req.body.skip ? parseInt(req.body.skip) : 0;

	let blogs;
	let categories;
	let tags;

	Blog.find({})
		.populate('categories', '_id name slug')
		.populate('tags', '_id name slug')
		.populate('postedBy', '_id name username profile')
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
		.exec((err, data) => {
			if (err) {
				return res.json({
					error: errorHandler(err),
				});
			}
			blogs = data; // blogs
			// get all categories
			Category.find({}).exec((err, c) => {
				if (err) {
					return res.json({
						error: errorHandler(err),
					});
				}
				categories = c; // categories
				// get all tags
				Tag.find({}).exec((err, t) => {
					if (err) {
						return res.json({
							error: errorHandler(err),
						});
					}
					tags = t;
					// return all blogs categories tags
					res.json({ blogs, categories, tags, size: blogs.length });
				});
			});
		});
};

exports.read = (req, res) => {
	const id = req.params.id.toLowerCase();
	console.log('dinesh id: ' + id);
	let query = `
	SELECT b.id, b.title, b.slug, b.body, 
	
	array_agg(distinct(c.name || '~' || c.id)) as categories, 	
	array_agg(distinct(t.name || '~' || t.id)) as tags

	FROM blog b
	 	LEFT outer JOIN categories as c ON c.id = SOME(b.categories)
	 	LEFT  JOIN tags as t ON t.id = SOME(b.tags)
	WHERE
		b.id = '${id}'	
	 GROUP BY title, b.id ORDER BY id `;

	db.any(query, [])
		.then((data) => {
			console.log('dinesh ' + JSON.stringify(data));
			return res.json(data[0]);
		})
		.catch((error) => {
			console.log('error ...' + error);
		});
};

exports.remove = (req, res) => {
	const slug = req.params.slug.toLowerCase();
	console.log("test slug---->",slug)
	db.any('delete from blog where slug = $1', [slug])
		.then((data) => {
			return res.json(data);
		})
		.catch((error) => {
			console.log('error ...' + error);
		});

	// Blog.findOneAndRemove({ slug }).exec((err, data) => {
	// 	if (err) {
	// 		return res.json({
	// 			error: errorHandler(err),
	// 		});
	// 	}
	// 	res.json({
	// 		message: 'Blog deleted successfully',
	// 	});
	//});
};

exports.update = (req, res) => {
	const id = req.params.id.toLowerCase();
	console.log('dinesh ' + id);
	let form = new formidable.IncomingForm();

	console.log('dinesh UPDATE > ' + JSON.stringify(form));

	var fileNames = [];
	form.keepExtensions = true;

	form.on('file', function (field, file) {
		fileNames.push(file.name);
		//On file received
	});

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: 'Image could not upload',
			});
		}

		const { title, body, categories, tags } = fields;

		console.log('title dinesh ' + title);
		console.log('body dinesh ' + body);
		console.log('categories dinesh ' + categories);
		console.log('tags dinesh ' + tags);

		let arrayOfCategories = categories && categories.split(',');
		let arrayOfTags = tags && tags.split(',');

		console.log('categoriesArr dinesh ' + arrayOfCategories);
		console.log('tagsArr dinesh ' + arrayOfTags);

		let slug = slugify(title).toLowerCase();
		let mtitle = `${title} | ${process.env.APP_NAME}`;

		let mdesc = stripHtml(body).result.substring(0, 160);

		console.log('mdesc dinesh ' + mdesc);

		let excerpt = smartTrim(body, 320, '', ' ...');

		let photodata;
		let photoContentType;

		if (files.photo) {
			if (files.photo.size > 10000000) {
				return res.status(400).json({
					error: 'Image should be less then 1mb in size',
				});
			}
			photodata = fs.readFileSync(files.photo.path);
			console.log('photo data ' + photodata);
			photoContentType = files.photo.type;

			fs.writeFile('./upload1', photodata, function (err) {
				if (err) console.log(err);
				//  return res.send("Successfully uploaded")
			});
		}

		db.one(
			` update blog set title = $1, slug = $2, body = $3, excerpt = $4, mtitle = $5, mdesc = $6, categories = $7::integer[], tags = $8::integer[]  
			where id = ${id}
			RETURNING id`,
			[title, slug, body, excerpt, mtitle, mdesc, arrayOfCategories, arrayOfTags]
		)
			.then((data) => {
				console.log('edited BLOG id: ' + data.id); // print new user id;
				res.json({ title: title, message: 'success' });
			})
			.catch((error) => {
				console.log('object.. error ' + JSON.stringify(error));
				return res.status(400).json({
					error: errorHandler(error),
				});
			});
	});
};

exports.photo = (req, res) => {
	const slug = req.params.slug.toLowerCase();
	Blog.findOne({ slug })
		.select('photo')
		.exec((err, blog) => {
			if (err || !blog) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			res.set('Content-Type', blog.photo.contentType);
			return res.send(blog.photo.data);
		});
};

exports.listRelated = (req, res) => {
	// console.log(req.body.blog);
	let limit = req.body.limit ? parseInt(req.body.limit) : 3;
	const { _id, categories } = req.body.blog;

	Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
		.limit(limit)
		.populate('postedBy', '_id name profile')
		.select('title slug excerpt postedBy createdAt updatedAt')
		.exec((err, blogs) => {
			if (err) {
				return res.status(400).json({
					error: 'Blogs not found',
				});
			}
			res.json(blogs);
		});
};
