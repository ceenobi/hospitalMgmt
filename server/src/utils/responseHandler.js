class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.success = false;
    this.isOperational = true;
  }
}

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

const sendResponse = (res, statusCode, data = null, message = null) => {
  const response = new ApiResponse(statusCode, data, message);
  return res.status(statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
};

const successResponse = (
  res,
  data,
  message = "Request successfull",
  statusCode = 200
) => {
  return sendResponse(res, statusCode, data, message);
};

const errorResponse = (
  message = "An error occurred",
  statusCode = 500,
  data = null
) => {
  return new AppError(message, statusCode, data);
};

const notFoundResponse = (message = "Resource not found") => {
  return errorResponse(message, 404);
};

const unauthorizedResponse = (message = "Unauthorized") => {
  return errorResponse(message, 401);
};

const forbiddenResponse = (message = "Forbidden") => {
  return errorResponse(message, 403);
};

export default {
  ApiResponse,
  sendResponse,
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
};
