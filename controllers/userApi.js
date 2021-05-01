const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const db = require('../helpers/db');

const create = (req, res) => {
	const { firstName,lastName,email,phoneNo,role } = req.body;
    let status="InActive";
    console.log("test uere req",req.body)

	db.one('INSERT INTO users(firstName,lastName,email,phoneNo,role,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING id', [firstName,lastName,email,phoneNo,role,status ])
		.then((data) => {
			console.log('new inserted id: ' + data.id); // print new user id;
			res.json({ result: 'success' });
		})
		.catch((error) => {
			console.log('object.. error ' + JSON.stringify(error));
			return res.status(400).json({
				error: errorHandler(error),
			});
		});
};



module.exports = {
	create
	
};
