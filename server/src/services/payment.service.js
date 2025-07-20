import Patient from "../models/patient.js";
import Payment from "../models/payment.js";
import { createPaymentTemplate } from "../utils/emailTemplates.js";
import { sendMail } from "../utils/mail.js";
import responseHandler from "../utils/responseHandler.js";
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
};

export default paymentService;
