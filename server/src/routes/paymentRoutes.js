import express from "express";
import { authorizedRoles, protect } from "../middelwares/authenticate.js";
import { validateFormData } from "../middelwares/validateFormData.js";
import { clearCache } from "../middelwares/cache.js";
import { createPayment } from "../controllers/paymentController.js";
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

export default router;
