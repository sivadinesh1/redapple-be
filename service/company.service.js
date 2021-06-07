const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const db = require('../helpers/db');

const create = (body) => {
    console.log("test body tag---->", body)
    const { name, status } = body;
    let slug = slugify(name).toLowerCase();
    let isDelete = false;
    let date=new Date()
    let query = `insert into company(name, status, isDelete, slug,createddate) values ($1, $2, $3, $4, $5) returning *`
    return new Promise(function (resolve, reject) {
        db.one(query, [name, status, isDelete, slug, date])
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

const edit = (body) => {
    const {id, name, status } = body;
    console.log("test name ---->", name + "test ----->", id)
    let slug = slugify(name).toLowerCase();
    let date=new Date()

    return new Promise(function (resolve, reject) {
        db.one(`update company set name = $1,status =$2, slug= $3,updateddate= $4 where id = ${id} RETURNING *`, [name,status, slug, date])
            .then((data) => {
                console.log('comapny updated successfully: ' + data.id); // print new user id;
                resolve(data)
            })
            .catch((error) => {
                console.log('object.. error ' + JSON.stringify(error));
                reject(error)
            });
    })

};

const list = () => {
    console.log("List method call--->")
    let query = 'select * from company';

    return new Promise(function (resolve, reject) {
        db.any(query)
            .then((data) => {
                console.log('caompany get successfully: ' + data.length); // print new user id;
                resolve(data)
            })
            .catch((error) => {
                console.log('object.. error ' + error);
                reject(error)
            });
    })
};

const read = (id) => {
    console.log("Get method call ---->", id)
    // const slug = data.toLowerCase();

    return new Promise(function (resolve, reject) {
        db.one('select * from company where isDelete=false and id = $1 ', [id])
            .then((data) => {
                if(data != null){
                console.log('company get successfully: ' + data.id); // print new user id;
                resolve(data)
                }else{
                    resolve(null)
                }
            })
            .catch((error) => {
                console.log('object.. error ' + JSON.stringify(error));
                reject(error)
            });
    })

};

const remove = (id) => {
   // const slug = data.toLowerCase();

    return new Promise(function (resolve, reject) {
        db.any('update company set isdelete=true where id = $1', [id])
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
