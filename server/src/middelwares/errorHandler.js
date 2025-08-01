import responseHandler from "../utils/responseHandler.js";
const { errorResponse, successResponse } = responseHandler;

// Error handler for development environment
const sendErrorDev = (err, res) => {
  const errResponse = {
    status: err.status || "error",
    message: err.message,
    stack: err.stack,
    error: {
      name: err.name,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
    },
  };
  console.error("ERROR ", err);
  res.status(err.statusCode || 500).json(errResponse);
};

// Error handler for production environment
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    const errResponse = {
      status: err.status || "error",
      message: err.message,
    };
    return res.status(err.statusCode || 500).json(errResponse);
  }
  // Programming or other unknown error: don't leak error details
  console.error("ERROR ", err);
  return res.status(err.statusCode).json({
    status: "error",
    message: "Something went wrong!",
  });
};

// Handle JWT errors
const handleJWTError = () =>
  errorResponse("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  errorResponse("Your token has expired! Please log in again.", 401);

// Handle Mongoose CastError
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return errorResponse(message, 400);
};

// Handle Mongoose duplicate fields
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return errorResponse(message, 400);
};

// Handle Mongoose ValidationError
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return errorResponse(message, 400);
};

// Main error handling middleware
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message, name: err.name };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};

// Catch 404 and forward to error handler
export const catchNotFound = (req, res, next) => {
  successResponse(
    res,
    null,
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
};
