const pgp = require('pg-promise')();
//var db = pgp('postgres://postgres:tesla@127.0.0.1:5432/redapple');
var db = pgp('postgres://red_apple:Redapple@123@192.168.2.26:5432/red_apple');

module.exports = db;
