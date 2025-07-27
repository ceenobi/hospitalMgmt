import Patient from "../models/patient.js";
import Payment from "../models/payment.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import {
  createPaymentTemplate,
  paymentReceiptTemplate,
  paymentStatusTemplate,
} from "../utils/emailTemplates.js";
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
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    paymentDate: {
                      ...(sanitizeStartDate && { $gte: sanitizeStartDate }),
                      ...(sanitizeEndDate && {
                        $lte: new Date(
                          sanitizeEndDate.setHours(23, 59, 59, 999)
                        ),
                      }),
                    },
                  }
                : {}),
            })
              .populate("patientId", "fullname email")
              .populate("doctorId", "fullname")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Payment.countDocuments({
              $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
              ...(status && { status: status }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    date: {
                      ...(sanitizeStartDate && { $gte: sanitizeStartDate }),
                      ...(sanitizeEndDate && {
                        $lte: new Date(
                          sanitizeEndDate.setHours(23, 59, 59, 999)
                        ),
                      }),
                    },
                  }
                : {}),
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
  getPatientPayments: async (
    page = 1,
    limit = 20,
    query = "",
    status = "",
    startDate = "",
    endDate = "",
    sort = "",
    userId,
    next
  ) => {
    const sanitizeStartDate = startDate ? new Date(startDate) : null;
    const sanitizeEndDate = endDate ? new Date(endDate) : null;
    const matchingPatient = await Patient.findOne({ userId: userId.toString() })
      .select("userId")
      .lean();
    if (!matchingPatient) {
      return next(notFoundResponse("No patient found"));
    }
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
              patientId: matchingPatient.userId.toString(),
              ...(status && { status: status }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    paymentDate: {
                      ...(sanitizeStartDate && { $gte: sanitizeStartDate }),
                      ...(sanitizeEndDate && {
                        $lte: new Date(
                          sanitizeEndDate.setHours(23, 59, 59, 999)
                        ),
                      }),
                    },
                  }
                : {}),
            })
              .populate("patientId", "fullname email")
              .populate("doctorId", "fullname")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Payment.countDocuments({
              patientId: matchingPatient.userId.toString(),
              ...(status && { status: status }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    paymentDate: {
                      ...(sanitizeStartDate && { $gte: sanitizeStartDate }),
                      ...(sanitizeEndDate && {
                        $lte: new Date(
                          sanitizeEndDate.setHours(23, 59, 59, 999)
                        ),
                      }),
                    },
                  }
                : {}),
            }),
          ])
        : await Promise.all([
            Payment.find({
              patientId: matchingPatient.userId.toString(),
            })
              .populate("patientId", "fullname email")
              .populate("doctorId", "fullname")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Payment.countDocuments({
              patientId: matchingPatient.userId.toString(),
            }),
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
  uploadReceipt: async (paymentId, receipt, next) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return next(notFoundResponse("No payment found with that email"));
    }
    if (!receipt) {
      return next(errorResponse("No file uploaded", 400));
    }
    const currentReceipt = payment.receipt;
    const currentReceiptId = payment.receiptId;
    if (currentReceipt) {
      await deleteFromCloudinary(currentReceiptId);
    }
    const { url, public_id } = await uploadToCloudinary(receipt, {
      folder: "Clinicare/receipts",
      format: "webp",
    });
    payment.receipt = url || payment.receipt;
    payment.receiptId = public_id || payment.receiptId;
    payment.paymentDate = new Date();
    await payment.save();
    const html = paymentReceiptTemplate(
      payment.patientId.fullname,
      payment.amount,
      payment.paymentDate,
      payment.receipt
    );
    await sendMail({
      to: process.env.EMAIL_USER,
      subject: "Payment Receipt Update",
      html,
    });
    return payment;
  },
  updatePayment: async (paymentId, paymentData, next) => {
    const payment = await Payment.findById(paymentId)
      .populate("doctorId", "fullname")
      .populate("patientId", "fullname email");
    if (!payment) {
      return next(notFoundResponse("No payment found"));
    }
    const patient = await Patient.findOne({
      userId: payment.patientId,
    }).lean();
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    for (const [key, value] of Object.entries(paymentData)) {
      if (value) {
        payment[key] = value;
      }
    }
    const updatedPayment = await payment.save();
    if (
      updatedPayment.status === "confirmed" ||
      updatedPayment.status === "cancelled"
    ) {
      const html = paymentStatusTemplate(
        patient.fullname,
        updatedPayment.amount,
        updatedPayment.status
      );
      await sendMail({
        to: patient.email,
        subject: "Payment Update",
        html,
      });
    }
    return updatedPayment;
  },
  deletePayment: async (paymentId, next) => {
    const payment = await Payment.findByIdAndDelete(paymentId);
    if (!payment) {
      return next(notFoundResponse("No payment found"));
    }
    return true;
  },
};

export default paymentService;
