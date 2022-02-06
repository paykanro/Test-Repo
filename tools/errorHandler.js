function errorHandler(error, statusCode, next){
  error.statusCode = statusCode;
  next(error);
};
function errorHandler(error,statusCode, message, next){
  error.statusCode = statusCode;
  error.message = message;
  next(error);
};
module.exports = errorHandler;

