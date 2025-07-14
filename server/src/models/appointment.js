import mongoose, { Schema, model } from "mongoose";

/**
 * Appointment schema
 * @typedef {Object} Appointment
 * @property {ObjectId} patientId - Reference to the patient who booked the appointment
 * @property {ObjectId} doctorId - Reference to the doctor
 * @property {Date} appointmentDate - Date of the appointment
 * @property {String} appointmentTime - Time of the appointment
 * @property {String} status - Status of the appointment
 * @property {String} notes - Notes about the appointment
 * @property {Date} createdAt - Timestamp when the appointment was created
 * @property {Date} updatedAt - Timestamp when the appointment was last updated
 */
const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    appointmentTime: {
      type: String,
      enum: ["10:00 AM", "1:00 PM", "3:00 PM"],
      required: [true, "Appointment time is required"],
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled"],
      default: "scheduled",
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

appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ appointmentTime: 1 });

const Appointment =
  mongoose.models.Appointment || model("Appointment", appointmentSchema);

export default Appointment;
