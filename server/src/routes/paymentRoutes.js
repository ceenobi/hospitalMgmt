import express from "express";
import { authorizedRoles, protect } from "../middelwares/authenticate.js";
import { validateFormData } from "../middelwares/validateFormData.js";
import { clearCache, cacheMiddleware } from "../middelwares/cache.js";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getPatientPayments,
  updatePayment,
  uploadReceipt,
} from "../controllers/paymentController.js";
import {
  validateCreatePaymentSchema,
  validatePaymentReceiptSchema,
} from "../utils/dataSchema.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  authorizedRoles("admin"),
  validateFormData(validateCreatePaymentSchema),
  clearCache("payments"),
  createPayment
);

router.get(
  "/all",
  protect,
  authorizedRoles("admin"),
  cacheMiddleware("payments", 3600),
  getAllPayments
);

router.get(
  "/patient",
  protect,
  authorizedRoles("admin", "doctor", "patient"),
  cacheMiddleware("patient_payments", 3600),
  getPatientPayments
);

router.patch(
  "/upload-receipt/:id",
  protect,
  authorizedRoles("patient"),
  validateFormData(validatePaymentReceiptSchema),
  clearCache("payments"),
  clearCache("patient_payments"),
  uploadReceipt
);

router.patch(
  "/:id/update",
  protect,
  authorizedRoles("admin"),
  validateFormData(validateCreatePaymentSchema),
  clearCache("payments"),
  updatePayment
);

router.delete(
  "/:id/delete",
  protect,
  authorizedRoles("admin"),
  clearCache("payments"),
  deletePayment
);

export default router;
