const AppError = require('../../utils/AppError');

const DeveloperError = (err, res) => {
    return res.status(500).json({
        error: err,
        message: err.message,
        status: err.statusCode
    });
};

exports.errorHandler = (req, res, err = AppError, next) => {
    DeveloperError(err, res);
};