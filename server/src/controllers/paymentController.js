import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
import paymentService from "../services/payment.service.js";
const { successResponse } = responseHandler;

export const createPayment = tryCatchFn(async (req, res, next) => {
  const payment = await paymentService.createPayment(req.validatedData, next);
  return successResponse(res, payment, "Payment created successfully", 201);
});

export const getAllPayments = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, status, startDate, endDate, sort } = req.query;
  const responseData = await paymentService.getAllPayments(
    parseInt(page),
    parseInt(limit),
    query,
    status,
    startDate,
    endDate,
    sort,
    next
  );
  return successResponse(
    res,
    responseData,
    "Payments data fetched successfully",
    200
  );
});
