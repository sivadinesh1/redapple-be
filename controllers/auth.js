const { encryptPassword } = require('../helpers/utils');
const db = require('../helpers/db');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// exports.read =(req, res) => {
//     req.profile.hashed_password = undefined;
//     return res.json(req.profile );
// }

exports.signup = async (req, res) => {
	const { name, email, password } = req.body;

	console.log('email >> ' + (await checkEmailExists(email)));

	if ((await checkEmailExists(email)) !== 0) {
		// return failure
		console.log('object... email exists..');
		return res.json({ error: 'email taken' });
	} else {
		insertUser(name, email, password);

		res.json({
			user: { name, email, password },
		});
	}
};

exports.signin = async (req, res) => {
	const { email, password } = req.body;
	// check if user exists
	let user = await checkEmailExists(email);
	if (user !== 0) {
		console.log('object..1.' + JSON.stringify(user));
		console.log('object..2.' + user.hashed_password);
		console.log('object..3.' + password);

		if (await bcrypt.compare(password, user.hashed_password)) {
			console.log('object ::: password matched' + user.id);

			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: '1d',
			});

			res.cookie('token', token, { expiresIn: '1d' });
			console.log("test users---->",user)
			const { id, username, name, email, role, companyid } = user;


			return res.json({
				token,
				user: { id, username, name, companyid, email, role},
			});

			// success
		} else {
			// failure
			console.log('object ::: password NOT matched');
			res.json({ message: 'Password match failed' });
		}
	} else {
		res.json({ message: 'User Not Found' });
	}
	// authenticate

	// generate a token and send to client
};

const checkEmailExists = (email) => {
	let query = ` select u.*, r.name as role_name, r.description as role_desc,
ur.role_id as role
    from 
    users u,
    role r,
    user_role ur
    where
    u.id = ur.user_id and
    ur.role_id = r.id and email = $1 `;

	return new Promise(function (resolve, reject) {
		db.oneOrNone(query, email)
			.then((user) => {
				if (user) {
					resolve(user); // user found
				} else {
					resolve(0); // null, user not found
				}
			})
			.catch((error) => {
				// something went wrong;
			});
	});
};

const checkIdExists = (id) => {
	let query = ` select u.*, r.name as role_name, 
    r.description as role_desc,
    ur.role_id as role
    from 
    users u,
    role r,
    user_role ur
    where
    u.id = ur.user_id and
    ur.role_id = r.id and id = $1 `;

	return new Promise(function (resolve, reject) {
		db.oneOrNone(query, id)
			.then((user) => {
				if (user) {
					resolve(user); // user found
				} else {
					resolve(0); // null, user not found
				}
			})
			.catch((error) => {
				// something went wrong;
			});
	});
};

const insertUser = async (name, email, password) => {
	let hashedpassword = await encryptPassword(password);
	console.log('hashed password from controller ' + hashedpassword);

	let username = nanoid(11);
	console.log('user name ' + username);

	let profile = `${process.env.CLIENT_URL}/profile/${username}`;
	let status = `A`;

	db.one(
		'INSERT INTO users(first_name, email, hashed_password, status, profile_url) VALUES($1, $2, $3, $4, $5) RETURNING id',
		[name, email, hashedpassword, status, profile]
	)
		.then((data) => {
			console.log('new inserted id: ' + data.id); // print new user id;

			db.one(
				'INSERT INTO user_role(user_id, role_id) VALUES($1, $2) RETURNING id',
				[data.id, 1]
			).then((data1) => {
				console.log('user role inserted..');
			});
		})
		.catch((error) => {
			console.log('ERROR:', error); // print error;
		});
};

exports.signout = (req, res) => {
	res.clearCookie('token');
	res.json({
		message: 'Signout success',
	});
};

exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: ['HS256'], // added later
	userProperty: 'auth',
});

exports.authMiddleware = (req, res, next) => {
	console.log('sssss >>. ' + JSON.stringify(req));
	const authUserId = req.user.id;

	let user = checkIdExists(authUserId);

	if (user === 0) {
		return res.status(400).json({
			error: 'User not found',
		});
	} else {
		req.profile = user;
		next();
	}
};

exports.adminMiddleware = (req, res, next) => {
	console.log('dinesh*#! ' + JSON.stringify(req.body));

	const adminUserId = req.user.id;

	let user = checkIdExists(adminUserId);

	if (user === 0) {
		return res.status(400).json({
			error: 'User not found',
		});
	} else {
		if (user.role !== 1) {
			return res.status(400).json({
				error: 'Admin resource. Access denied',
			});
		}

		req.profile = user;
		next();
	}
};
