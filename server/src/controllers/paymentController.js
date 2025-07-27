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

export const getPatientPayments = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const { page, limit, query, status, time, startDate, endDate } = req.query;
  const responseData = await paymentService.getPatientPayments(
    parseInt(page),
    parseInt(limit),
    query,
    status,
    time,
    startDate,
    endDate,
    userId,
    next
  );
  return successResponse(
    res,
    responseData,
    "Patient payments data fetched successfully",
    200
  );
});

export const uploadReceipt = tryCatchFn(async (req, res, next) => {
  const { id: paymentId } = req.params;
  const responseData = await paymentService.uploadReceipt(
    paymentId,
    req.body.receipt,
    next
  );
  return successResponse(
    res,
    responseData,
    "Receipt uploaded successfully, Kindly check back for payment confirmation.",
    200
  );
});

export const updatePayment = tryCatchFn(async (req, res, next) => {
  const { id: paymentId } = req.params;
  const responseData = await paymentService.updatePayment(
    paymentId,
    req.validatedData,
    next
  );
  return successResponse(
    res,
    responseData,
    "Payment updated successfully",
    200
  );
});

export const deletePayment = tryCatchFn(async (req, res, next) => {
  const { id: paymentId } = req.params;
  const responseData = await paymentService.deletePayment(paymentId, next);
  return successResponse(
    res,
    responseData,
    "Payment deleted successfully",
    200
  );
});
