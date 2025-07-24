import express from "express";
import { authorizedRoles, protect } from "../middelwares/authenticate.js";
import { validateFormData } from "../middelwares/validateFormData.js";
import { clearCache, cacheMiddleware } from "../middelwares/cache.js";
import {
  createPayment,
  getAllPayments,
} from "../controllers/paymentController.js";
import { validateCreatePaymentSchema } from "../utils/dataSchema.js";

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

export default router;
