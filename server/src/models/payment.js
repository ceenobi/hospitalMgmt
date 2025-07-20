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
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer", ""],
      default: "",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    paymentDate: {
      type: Date,
      required: [true, "Payment date is required"],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    receipt: {
      type: String,
      required: [true, "Receipt is required"],
      default: "N/A",
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
paymentSchema.index({ paymentMethod: 1 });

const Payment = mongoose.models.Payment || model("Payment", paymentSchema);

export default Payment;
