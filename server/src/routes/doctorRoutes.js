import express from "express";
import { validateFormData } from "../middelwares/validateFormData.js";
import { validateDoctorSchema } from "../utils/dataSchema.js";
import {
  register,
  getAllUserCollections,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import { protect, authorizedRoles } from "../middelwares/authenticate.js";
import { cacheMiddleware, clearCache } from "../middelwares/cache.js";

const router = express.Router();

router.post(
  "/register",
  protect,
  authorizedRoles("admin"),
  validateFormData(validateDoctorSchema),
  clearCache("doctors"),
  register
);

router.get(
  "/meta",
  protect,
  authorizedRoles("admin", "doctor", "nurse", "staff"),
  cacheMiddleware("doctors_users", 3600),
  getAllUserCollections
);

router.get(
  "/",
  protect,
  authorizedRoles("admin", "doctor", "nurse", "staff"),
  cacheMiddleware("doctors", 3600),
  getAllDoctors
);

router.patch(
  "/:id/update",
  protect,
  authorizedRoles("admin"),
  validateFormData(validateDoctorSchema),
  clearCache("doctors"),
  updateDoctor
);

router.delete(
  "/:id/delete",
  protect,
  authorizedRoles("admin"),
  clearCache("doctors"),
  deleteDoctor
);

export default router;
