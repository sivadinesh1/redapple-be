const pgp = require('pg-promise')();
var db = pgp('postgres://postgres:tesla@127.0.0.1:5432/redapple');

module.exports = db;
