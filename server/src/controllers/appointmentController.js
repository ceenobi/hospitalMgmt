import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
import appointmentService from "../services/appointment.service.js";
const { successResponse } = responseHandler;

export const getAppointmentMeta = tryCatchFn(async (req, res, next) => {
  const appointmentMeta = await appointmentService.getAppointmentMeta();
  successResponse(
    res,
    appointmentMeta,
    "Appointment meta data fetched successfully",
    200
  );
});

export const bookAppointment = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const appointment = await appointmentService.bookAppointment(next, {
    ...req.validatedData,
    userId,
  });
  successResponse(
    res,
    appointment,
    "Appointment booked! You will receive a confirmation email",
    201
  );
});

export const createAppointment = tryCatchFn(async (req, res, next) => {
  const appointment = await appointmentService.createAppointment(
    req.validatedData,
    next
  );
  successResponse(res, appointment, "Appointment created successfully", 201);
});

export const getAllAppointments = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, status, time, startDate, endDate } = req.query;
  const responseData = await appointmentService.getAllAppointments(
    parseInt(page),
    parseInt(limit),
    query,
    status,
    time,
    startDate,
    endDate,
    next
  );
  successResponse(
    res,
    responseData,
    "Appointments data fetched successfully",
    200
  );
});

export const getPatientAppointments = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const { page, limit, query, status, time, startDate, endDate } = req.query;
  const responseData = await appointmentService.getPatientAppointments(
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
  successResponse(
    res,
    responseData,
    "Patient appointments data fetched successfully",
    200
  );
});

export const updateAppointment = tryCatchFn(async (req, res, next) => {
  const { id: appointmentId } = req.params;
  const responseData = await appointmentService.updateAppointment(
    appointmentId,
    req.validatedData,
    next
  );
  successResponse(res, responseData, "Appointment updated successfully", 200);
});

export const deleteAppointment = tryCatchFn(async (req, res, next) => {
  const { id: appointmentId } = req.params;
  const responseData = await appointmentService.deleteAppointment(
    appointmentId,
    next
  );
  successResponse(res, responseData, "Appointment deleted successfully", 200);
});
