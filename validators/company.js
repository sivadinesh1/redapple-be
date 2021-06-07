const { check } = require('express-validator');

exports.companyCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
];