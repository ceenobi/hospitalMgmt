import Patient from "../models/patient.js";
import Payment from "../models/payment.js";
import { createPaymentTemplate } from "../utils/emailTemplates.js";
import { sendMail } from "../utils/mail.js";
import responseHandler from "../utils/responseHandler.js";
import { sortPaymentMethods } from "../utils/sortMethods.js";
const { errorResponse, notFoundResponse } = responseHandler;

const paymentService = {
  createPayment: async (paymentData, next) => {
    const payment = await Payment.create({
      ...paymentData,
    });
    if (!payment) {
      return next(errorResponse("Payment not created", 400));
    }
    const patient = await Patient.findOne({
      userId: payment.patientId,
    }).lean();
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    const html = createPaymentTemplate(patient.fullname, payment.amount);
    await sendMail({
      to: patient.email,
      subject: "Payment Information",
      html,
    });
    return payment;
  },
  getAllPayments: async (
    page = 1,
    limit = 20,
    query = "",
    status = "",
    startDate = "",
    endDate = "",
    sort = "",
    next
  ) => {
    const sanitizeStartDate = startDate ? new Date(startDate) : null;
    const sanitizeEndDate = endDate ? new Date(endDate) : null;
    const sanitizeQuery = query
      ? query
          .trim()
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
      : "";
    const [payments, total] =
      sanitizeQuery || status || startDate || endDate
        ? await Promise.all([
            Payment.find({
              $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
              ...(status && { status: status }),
              ...(sanitizeStartDate && {
                paymentDate: { $gte: sanitizeStartDate },
              }),
              ...(sanitizeEndDate && {
                paymentDate: { $lte: sanitizeEndDate },
              }),
            })
              .populate("patientId", "fullname email")
              .populate("doctorId", "fullname")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Payment.countDocuments({
              $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
              ...(status && { status: status }),
              ...(sanitizeStartDate && {
                paymentDate: { $gte: sanitizeStartDate },
              }),
              ...(sanitizeEndDate && {
                paymentDate: { $lte: sanitizeEndDate },
              }),
            }),
          ])
        : await Promise.all([
            Payment.find()
              .populate("patientId", "fullname email")
              .populate("doctorId", "fullname")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Payment.countDocuments(),
          ]);
    if (!payments) {
      return next(notFoundResponse("No payments found"));
    }
    const sortedPayments = sort
      ? payments.sort(sortPaymentMethods[sort].method)
      : payments;
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + payments.length < total,
        limit,
      },
      payments: sortedPayments,
    };
  },
};

export default paymentService;
