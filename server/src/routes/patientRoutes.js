import express from "express";
import { protect, authorizedRoles } from "../middelwares/authenticate.js";
import { cacheMiddleware, clearCache } from "../middelwares/cache.js";
import { validateFormData } from "../middelwares/validateFormData.js";
import { validatePatientSchema } from "../utils/dataSchema.js";
import {
  deletePatient,
  getAllPatients,
  getPatient,
  register,
  updatePatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.post(
  "/register",
  protect,
  authorizedRoles("admin", "patient"),
  validateFormData(validatePatientSchema),
  clearCache("auth_user"),
  clearCache("patients"),
  clearCache("patient"),
  register
);

router.get("/all", protect, cacheMiddleware("patients", 3600), getAllPatients);
router.get("/me", protect, cacheMiddleware("patient", 3600), getPatient);

router.patch(
  "/:id/update",
  protect,
  authorizedRoles("admin", "patient"),
  validateFormData(validatePatientSchema),
  clearCache("patients"),
  clearCache("patient"),
  updatePatient
);

router.delete(
  "/:id/delete",
  protect,
  authorizedRoles("admin"),
  clearCache("patients"),
  clearCache("patient"),
  deletePatient
);

export default router;
