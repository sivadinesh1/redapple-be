const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const db = require('../helpers/db');

const create = (req, res) => {
	const { name } = req.body;
	console.log('dinesh:::: ' + name);
	let slug = slugify(name).toLowerCase();

	db.one('INSERT INTO tags(name, slug) VALUES($1, $2) RETURNING id', [
		name,
		slug,
	])
		.then((data) => {
			console.log('new inserted id: ' + data.id); // print new user id;
			res.json(data);
		})
		.catch((error) => {
			console.log('object.. error ' + JSON.stringify(err));
			return res.status(400).json({
				error: errorHandler(err),
			});
		});
};

const list = (req, res) => {
	let query = 'select * from tags';

	db.any(query, [])
		.then((data) => {
			return res.json(data);
		})
		.catch((error) => {
			console.log('error ...' + error);
		});
};

const read = (req, res) => {
	const slug = req.params.slug.toLowerCase();

	db.any('select * from tags where slug = $1', [slug])
		.then((data) => {
			return res.json(data);
		})
		.catch((error) => {
			console.log('error ...' + error);
		});
};

const remove = (req, res) => {
	const slug = req.params.slug.toLowerCase();

	db.any('delete from tags where slug = $1', [slug])
		.then((data) => {
			return res.json(data);
		})
		.catch((error) => {
			console.log('error ...' + error);
		});
};

module.exports = {
	create,
	remove,
	list,
	read,
};
