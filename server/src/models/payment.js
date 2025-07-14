import mongoose, { model, Schema } from "mongoose";

const paymentSchema = new Schema({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: [true, "Appointment is required"],
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: [true, "Patient is required"],
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Doctor is required"],
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "online"],
    default: "cash",
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  paymentDate: {
    type: Date,
    required: [true, "Payment date is required"],
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  transactionId: {
    type: String,
    required: [true, "Transaction ID is required"],
  },
});

paymentSchema.index({ appointmentId: 1 });
paymentSchema.index({ patientId: 1 });
paymentSchema.index({ doctorId: 1 });
paymentSchema.index({ paymentDate: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.models.Payment || model("Payment", paymentSchema);

export default Payment;
