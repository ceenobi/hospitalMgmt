import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import Appointment from "../models/appointment.js";
import { sendMail } from "../utils/mail.js";
import { appointmentStatusTemplate } from "../utils/emailTemplates.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const appointmentService = {
  getAppointmentMeta: async () => {
    const [patientMeta, doctorMeta] = await Promise.all([
      Patient.find().select("userId").populate("userId", "fullname").lean(),
      Doctor.find({ availability: "available" })
        .select("userId")
        .populate("userId", "fullname")
        .lean(),
    ]);
    if (!patientMeta || !doctorMeta) {
      return next(notFoundResponse("No patient or doctor found"));
    }
    return {
      patientMeta,
      doctorMeta,
    };
  },
  bookAppointment: async (next, appointmentData) => {
    const appointmentDate = new Date(appointmentData.appointmentDate);
    const currentDate = new Date();
    appointmentDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    const appointmentExists = await Appointment.findOne({
      patientId: appointmentData.userId,
      appointmentTime: appointmentData.appointmentTime,
      appointmentDate: appointmentData.appointmentDate,
    }).lean();
    if (appointmentDate < currentDate) {
      return next(errorResponse("Appointment date cannot be in the past", 400));
    }
    if (
      appointmentExists &&
      new Date(appointmentData.appointmentDate) ===
        new Date(appointmentExists.appointmentDate)
    ) {
      return next(errorResponse("Appointment time already booked", 400));
    }

    const appointment = await Appointment.create({
      ...appointmentData,
      patientId: appointmentData.userId,
    });
    return appointment;
  },
  createAppointment: async (appointmentData, next) => {
    if (appointmentData.appointmentDate < new Date()) {
      return next(errorResponse("Appointment date cannot be in the past", 400));
    }
    const appointmentExists = await Appointment.findOne({
      patientId: appointmentData.patientId,
      doctorId: appointmentData.doctorId,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
    }).lean();
    const appointmentTimeExists = await Appointment.findOne({
      doctorId: appointmentData.doctorId,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
    }).lean();
    if (appointmentExists || appointmentTimeExists) {
      return next(
        errorResponse(
          appointmentExists
            ? "Appointment already exists"
            : "Appointment time already exists for this doctor",
          400
        )
      );
    }
    const appointment = await Appointment.create({
      ...appointmentData,
    });
    if (appointment.status === "confirmed") {
      const patient = await Patient.findOne({
        userId: appointment.patientId,
      }).lean();
      const html = appointmentStatusTemplate(
        patient.fullname,
        appointment.status
      );
      await sendMail({
        to: patient.email,
        subject: "Appointment Update",
        html,
      });
    }
    return appointment;
  },
  getAllAppointments: async (
    page = 1,
    limit = 20,
    query = "",
    status = "",
    time = "",
    startDate = "",
    endDate = "",
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
    const [matchingDoctors, matchingPatients] = await Promise.all([
      Doctor.find().populate("userId", "fullname").select("_id").lean(),
      Patient.find({
        $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
      })
        .select("_id")
        .lean(),
    ]);

    const doctorIds = matchingDoctors.map((doc) =>
      doc.userId.fullname.toLowerCase().includes(sanitizeQuery)
        ? doc.userId._id
        : null
    );
    const patientIds = matchingPatients.map((patient) => patient._id);

    const [appointments, total] =
      sanitizeQuery || time || status || startDate || endDate
        ? await Promise.all([
            Appointment.find({
              ...(sanitizeQuery && {
                $or: [
                  { doctorId: { $in: doctorIds } },
                  { patientId: { $in: patientIds } },
                ],
              }),
              ...(status && { status: status }),
              ...(time && { appointmentTime: time }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    appointmentDate: {
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
              .populate("doctorId", "fullname")
              .populate("patientId", "fullname email phone")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean(),
            Appointment.countDocuments({
              ...(sanitizeQuery && {
                $or: [
                  { doctorId: { $in: doctorIds } },
                  { patientId: { $in: patientIds } },
                ],
              }),
              ...(status && { status: status }),
              ...(time && { appointmentTime: time }),
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
            Appointment.find()
              .populate("doctorId", "fullname")
              .populate("patientId", "fullname email phone")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean(),
            Appointment.countDocuments(),
          ]);
    if (!appointments) {
      return next(notFoundResponse("No appointments found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + appointments.length < total,
        limit,
      },
      appointments,
    };
  },
  getPatientAppointments: async (
    page = 1,
    limit = 20,
    query = "",
    status = "",
    time = "",
    startDate = "",
    endDate = "",
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
    const [appointments, total] =
      query || status || time || startDate || endDate
        ? await Promise.all([
            Appointment.find({
              patientId: matchingPatient.userId.toString(),
              ...(status && { status: status }),
              ...(time && { appointmentTime: time }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    appointmentDate: {
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
              .populate("patientId", "fullname email phone")
              .populate("doctorId", "fullname")
              .sort({ appointmentDate: 1, appointmentTime: 1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean(),
            Appointment.countDocuments({
              patientId: matchingPatient.userId.toString(),
              ...(status && { status: status }),
              ...(time && { appointmentTime: time }),
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
            Appointment.find({
              patientId: matchingPatient.userId.toString(),
            })
              .populate("patientId", "fullname email")
              .populate("doctorId", "fullname")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean(),
            Appointment.countDocuments({
              patientId: matchingPatient.userId.toString(),
            }),
          ]);
    if (!appointments) {
      return next(notFoundResponse("No appointments found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + appointments.length < total,
        limit,
      },
      appointments,
    };
  },
  updateAppointment: async (appointmentId, appointmentData, next) => {
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "fullname")
      .populate("patientId", "fullname email");
    if (!appointment) {
      return next(notFoundResponse("No appointment found"));
    }
    const patient = await Patient.findOne({
      userId: appointment.patientId,
    }).lean();
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    for (const [key, value] of Object.entries(appointmentData)) {
      if (value) {
        appointment[key] = value;
      }
    }
    const updatedAppointment = await appointment.save();
    if (
      updatedAppointment.status === "confirmed" ||
      updatedAppointment.status === "cancelled"
    ) {
      const html = appointmentStatusTemplate(
        patient.fullname,
        updatedAppointment.status
      );
      await sendMail({
        to: patient.email,
        subject: "Appointment Booking Update",
        html,
      });
    }
    return updatedAppointment;
  },
  deleteAppointment: async (appointmentId, next) => {
    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      return next(notFoundResponse("No appointment found"));
    }
    return true;
  },
};

export default appointmentService;
