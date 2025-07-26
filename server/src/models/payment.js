import mongoose, { model, Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    paymentDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    receipt: {
      type: String,
      default: "",
    },
    receiptId: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      maxlength: [255, "Notes cannot be more than 255 characters"],
      required: [true, "Notes is required"],
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ patientId: 1 });
paymentSchema.index({ doctorId: 1 });
paymentSchema.index({ paymentDate: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.models.Payment || model("Payment", paymentSchema);

export default Payment;
