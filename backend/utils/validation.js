const  { validationResult } = require('express-validator');

//middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    //If validationErrors array is not empty
    if(!validationErrors.isEmpty()){
        const errors = {};
        validationErrors
        .array()
        .forEach(error => errors[error.path] = error.msg);

        const err = Error('Bad Request');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad Request';
        next(err);
    }

    //If no errors
    next();
};

module.exports = { handleValidationErrors };