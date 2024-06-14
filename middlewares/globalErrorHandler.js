const globalErrorHandler = (err, req, res, next) => {
  // stack
  const stack = err.stack;
  // message
  const message = err.message;
  // status: failed/server error/something
  const status = err.status ? err.status : "failed";
  //statusCode
  const statusCode = err.statusCode ? err.statusCode : 500;

  //send response
  res.status(statusCode).json({
    message,
    status,
    stack,
  });
};

module.exports = globalErrorHandler;