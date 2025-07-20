import tryCatchFn from "../utils/tryCatchFn.js";
import doctorService from "../services/doctor.service.js";
import responseHandler from "../utils/responseHandler.js";
const { successResponse } = responseHandler;

export const register = tryCatchFn(async (req, res, next) => {
  const responseData = await doctorService.register(req.validatedData, next);
  return successResponse(res, responseData, "Doctor registered successfully", 201);
});

export const getAllUserCollections = tryCatchFn(async (req, res, next) => {
  const responseData = await doctorService.getAllUserCollections(next);
  return successResponse(res, responseData, "Users data fetched successfully", 200);
});

export const getAllDoctors = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, specialization, availability } = req.query;
  const responseData = await doctorService.getAllDoctors(
    parseInt(page),
    parseInt(limit),
    query,
    specialization,
    availability,
    next
  );
  return successResponse(res, responseData, "Doctors data fetched successfully", 200);
});

export const updateDoctor = tryCatchFn(async (req, res, next) => {
  const { id: doctorId } = req.params;
  const responseData = await doctorService.updateDoctor(
    doctorId,
    req.validatedData,
    next
  );
  return successResponse(res, responseData, "Doctor updated successfully", 200);
});

export const deleteDoctor = tryCatchFn(async (req, res, next) => {
  const { id: doctorId } = req.params;
  const responseData = await doctorService.deleteDoctor(doctorId, next);
  return successResponse(res, responseData, "Doctor deleted successfully", 200);
});
