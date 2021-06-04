const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const db = require('../helpers/db');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const categoryService=require('../service/category.service')

const create =catchAsync(async (req, res) => {
	const { name } = req.body;
	const category = await categoryService.create(name);
  	res.status(httpStatus.CREATED).send(category);
});

const edit = catchAsync(async (req, res) => {
	const category = await categoryService.edit(req.body);
	res.send(category);
  });

  const list = catchAsync(async (req,res) => {

	const categories = await categoryService.list();
	if (!categories ) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'categories not found');
	}
	 res.send(categories);
  });

  const read = catchAsync(async (req,res) => {
	  
	const category = await categoryService.read(req.params.slug);
	if (!category ) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'category not found');
	}
	 res.send(category);
  });

const remove = catchAsync(async (req, res) => {
	const category=await categoryService.remove(req.params.slug);
	res.send(category);
  });
  

// const create = (req, res) => {
// 	const { name } = req.body;
// 	console.log('dinesh:::: ' + name);
// 	let slug = slugify(name).toLowerCase();

// 	db.one('INSERT INTO categories(name, slug) VALUES($1, $2) RETURNING id', [name, slug])
// 		.then((data) => {
// 			console.log('new inserted id: ' ,res.json(data)); // print new user id;
// 			res.json(data);
// 		})
// 		.catch((error) => {
// 			console.log('object.. error ' + JSON.stringify(error));
// 			return res.status(400).json({
// 				error: errorHandler(error),
// 			});
// 		});
// };

// const edit = (req, res) => {
// 	const { name, id } = req.body;
// 	console.log("test category name ---->",name +"test ----->",id) 
// 	let slug = slugify(name).toLowerCase();

// 	db.one(`update categories set name = $1, slug= $2 where id = ${id} RETURNING id`, [name, slug])
// 		.then((data) => {
// 			console.log('category updted id: ' + data.id); // print new user id;
// 			res.json({ result: 'success' });
// 		})
// 		.catch((error) => {
// 			console.log('object.. error ' + JSON.stringify(error));
// 			return res.status(400).json({
// 				error: errorHandler(error),
// 			});
// 		});
// };

// const list = (req, res) => {
// 	let query = 'select * from categories';

// 	db.any(query, [])
// 		.then((data) => {
// 			return res.json(data);
// 		})
// 		.catch((error) => {
// 			console.log('error ... dinesh > ' + error);
// 		});
// };

// const read = (req, res) => {
// 	const slug = req.params.slug.toLowerCase();

// 	db.any('select * from categories where slug = $1', [slug])
// 		.then((data) => {
// 			return res.json(data);
// 		})
// 		.catch((error) => {
// 			console.log('error ...' + error);
// 		});
// };

// const remove = (req, res) => {
// 	const slug = req.params.slug.toLowerCase();

// 	db.any('delete from categories where slug = $1', [slug])
// 		.then((data) => {
// 			return res.json(data);
// 		})
// 		.catch((error) => {
// 			console.log('error ...' + error);
// 		});
// };

module.exports = {
	create,
	remove,
	list,
	read,
	edit
};
