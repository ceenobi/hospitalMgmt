import tryCatchFn from "../utils/tryCatchFn.js";
import patientService from "../services/patient.service.js";
import responseHandler from "../utils/responseHandler.js";
const { successResponse } = responseHandler;

export const register = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await patientService.register(
    req.validatedData,
    userId,
    next
  );
  return successResponse(res, responseData, "Patient registered successfully", 201);
});

export const getAllPatients = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, gender, bloodGroup, sort } = req.query;
  const responseData = await patientService.getAllPatients(
    parseInt(page),
    parseInt(limit),
    query,
    gender,
    bloodGroup,
    sort,
    next
  );
  return successResponse(res, responseData, "Patients data fetched successfully", 200);
});

export const updatePatient = tryCatchFn(async (req, res, next) => {
  const { id: patientId } = req.params;
  const responseData = await patientService.updatePatient(
    patientId,
    req.validatedData,
    next
  );
  return successResponse(res, responseData, "Patient updated successfully", 200);
});

export const deletePatient = tryCatchFn(async (req, res, next) => {
  const { id: patientId } = req.params;
  const responseData = await patientService.deletePatient(patientId, next);
  return successResponse(res, responseData, "Patient deleted successfully", 200);
});

export const getPatient = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await patientService.getPatient(userId, next);
  return successResponse(res, responseData, "Patient fetched successfully", 200);
});
