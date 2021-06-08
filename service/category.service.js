const slugify = require('slugify');
const db = require('../helpers/db');

const create = (body) => {
    // console.log("test body tag---->",name)
    const {name,companyId}=body
    let slug = slugify(name).toLowerCase(); 
    return new Promise (function (resolve, reject){
        db.one('INSERT INTO categories(name, slug,companyId) VALUES($1, $2, $3) RETURNING id', [name, slug, companyId])
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

const edit = (reqbody) => {
	const { name, id } = reqbody;
	console.log("test name ---->",name +"test ----->",id) 
    let slug = slugify(name).toLowerCase();
    
    return new Promise (function (resolve, reject){
        db.one(`update categories set name = $1, slug= $2 where id = ${id} RETURNING id`, [name, slug])
		.then((data) => {
			console.log('category updated successfully: ' + data.id); // print new user id;
            resolve({ result: 'success' })
		})
		.catch((error) => {
			console.log('object.. error ' + JSON.stringify(error));
            reject(error)
		});
    })
	
};

const list = (companyId) => {
    console.log("List method call--->")
	let query = 'select * from categories c where c.companyId = $1';

    return new Promise (function (resolve, reject){
        db.any(query,[companyId])
		.then((data) => {
			console.log('categories get successfully: ' + data.length); // print new user id;
            resolve(data)
		})
		.catch((error) => {
			console.log('object.. error ' + error);
            reject(error)
		});
    })
};

const read = (data) => {
    console.log("Get method call ---->",data)
	const slug = data.toLowerCase();

    return new Promise (function (resolve, reject){
        db.one('select * from categories where slug = $1', [slug])
		.then((data) => {
			console.log('category get successfully: ' + data.id); // print new user id;
            resolve(data)
		})
		.catch((error) => {
			console.log('object.. error ' + JSON.stringify(error));
            reject(error)
		});
    })
	
};

const remove = (data) => {
    const slug = data.toLowerCase();
    
return new Promise(function(resolve,reject){
	db.any('delete from categories where slug = $1', [slug])
		.then((data) => {
            console.log("data deleted successfully-->")
            resolve(data)
		})
		.catch((error) => {
            console.log('error ...' + error);
            reject(error)
        });
    })
};

module.exports = {
	create,
	remove,
	list,
	read,
	edit,
};
