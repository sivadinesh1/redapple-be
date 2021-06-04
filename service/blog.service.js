const formidable = require('formidable');
const slugify = require('slugify');
const { stripHtml } = require('string-strip-html');

const { errorHandler } = require('../helpers/dbErrorHandler');
const db = require('../helpers/db');

const { smartTrim } = require('../helpers/utils');

const fs = require('fs');
const axios = require('axios')


const create1 = () => {
    console.log("test body tag---->",name)
    let slug = slugify(name).toLowerCase(); 
    return new Promise (function (resolve, reject){
        db.one('INSERT INTO categories(name, slug) VALUES($1, $2) RETURNING id', [name, slug])
		.then((data) => {
			console.log('new inserted id: ' + data.id); // print new user id;
            resolve(data)
		})
		.catch((error) => {
			console.log('object.. error ' + JSON.stringify(error));
            reject(error)
		});
    })
};

const create = (req) => {
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

        return new Promise (function (resolve, reject){
            db.one('INSERT INTO blog(title, slug, body, excerpt, mtitle, mdesc, categories, tags) VALUES($1, $2, $3, $4, $5, $6, $7::integer[], $8::integer[]) RETURNING id',
			[title, slug, body, excerpt, mtitle, mdesc, arrayOfCategories, arrayOfTags])
            .then((data) => {
                console.log('new inserted blog id--> ' + data.id); // print new user id;
                resolve({ title: title, message: 'success' })
            })
            .catch((error) => {
                console.log('object.. error ' + JSON.stringify(error));
                reject({
					error: errorHandler(error)
				})
            });
        })

		// db.one(
		// 	'INSERT INTO blog(title, slug, body, excerpt, mtitle, mdesc, categories, tags) VALUES($1, $2, $3, $4, $5, $6, $7::integer[], $8::integer[]) RETURNING id',
		// 	[title, slug, body, excerpt, mtitle, mdesc, arrayOfCategories, arrayOfTags]
		// )
		// 	.then((data) => {
		// 		console.log('new inserted BLOG id: ' + data.id); // print new user id;
		// 		res.json({ title: title, message: 'success' });
		// 	})
		// 	.catch((error) => {
		// 		console.log('object.. error ' + JSON.stringify(error));
		// 		return res.status(400).json({
		// 			error: errorHandler(error),
		// 		});
		// 	});
	});
};


module.exports = {
	create
	
};
