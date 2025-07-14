import express from "express";
import {
  bookAppointment,
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentMeta,
  getPatientAppointments,
  updateAppointment,
} from "../controllers/appointmentController.js";
import { protect, authorizedRoles } from "../middelwares/authenticate.js";
import { cacheMiddleware, clearCache } from "../middelwares/cache.js";
import { validateFormData } from "../middelwares/validateFormData.js";
import {
  validateAppointmentSchema,
  validateBookAppointmentSchema,
} from "../utils/dataSchema.js";

const router = express.Router();

router.get(
  "/meta",
  protect,
  cacheMiddleware("appointment_meta", 3600),
  getAppointmentMeta
);

router.post(
  "/book",
  protect,
  authorizedRoles("patient"),
  validateFormData(validateBookAppointmentSchema),
  clearCache("patient_appointments"),
  clearCache("appointments"),
  bookAppointment
);
router.post(
  "/create",
  protect,
  authorizedRoles("admin", "nurse"),
  validateFormData(validateAppointmentSchema),
  clearCache("appointments"),
  createAppointment
);
router.get(
  "/all",
  protect,
  authorizedRoles("admin", "doctor", "nurse"),
  cacheMiddleware("appointments", 3600),
  getAllAppointments
);
router.get(
  "/patient",
  protect,
  authorizedRoles("admin", "doctor", "patient"),
  cacheMiddleware("patient_appointments", 3600),
  getPatientAppointments
);
router.patch(
  "/:id/update",
  protect,
  authorizedRoles("admin", "doctor", "nurse"),
  validateFormData(validateAppointmentSchema),
  clearCache("appointments"),
  updateAppointment
);
router.delete(
  "/:id/delete",
  protect,
  authorizedRoles("admin", "doctor", "nurse"),
  clearCache("appointments"),
  deleteAppointment
);
export default router;
