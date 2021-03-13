const pgp = require('pg-promise')()
var db = pgp("postgres://postgres:tesla@127.0.0.1:5432/redapple")


module.exports = db;


// The same with ES7 syntax:

// db.task(async t => {
//    const a = await checkUserName(t);
//    const b = await checkEmail(t);
//    const c = await checkWhateverElse(t);
//    return {a, b, c};
// })
// .then(data => {
//     // data = {a, b, c} object;
// })
// .catch(error => {
//    // error
// });