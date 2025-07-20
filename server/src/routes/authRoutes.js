import express from "express";
import {
  validateSignUpSchema,
  validateLoginSchema,
  verifyAccountSchema,
  validateResetPasswordSchema,
  validateResendPasswordTokenSchema,
  validateUserSchema,
  updatePasswordSchema,
} from "../utils/dataSchema.js";
import {
  signup,
  signin,
  resendVerificationToken,
  verifyAccount,
  getPasswordResetToken,
  resetPassword,
  logout,
  getUser,
  uploadAvatar,
  updateUser,
  updateUserPassword,
  deleteAccount,
  refreshToken,
} from "../controllers/authController.js";
import { validateFormData } from "../middelwares/validateFormData.js";
import { rateLimiter, refreshTokenLimiter } from "../middelwares/rateLimit.js";
import { protect } from "../middelwares/authenticate.js";
import { cacheMiddleware, clearCache } from "../middelwares/cache.js";

const router = express.Router();

router.post("/signup", validateFormData(validateSignUpSchema), signup);
router.post(
  "/signin",
  rateLimiter,
  validateFormData(validateLoginSchema),
  signin
);
router.post("/refresh-token", refreshTokenLimiter, refreshToken);
router.post(
  "/resend-verify-token",
  rateLimiter,
  protect,
  resendVerificationToken
);
router.patch(
  "/verify-account",
  rateLimiter,
  protect,
  validateFormData(verifyAccountSchema),
  clearCache("auth_user"),
  verifyAccount
);
router.post(
  "/get-password-reset-token",
  rateLimiter,
  validateFormData(validateResendPasswordTokenSchema),
  getPasswordResetToken
);
router.patch(
  "/reset-password",
  rateLimiter,
  validateFormData(validateResetPasswordSchema),
  resetPassword
);
router.post("/logout", clearCache("auth_user"), logout);

router.get("/user", protect, cacheMiddleware("auth_user", 3600), getUser);

router.patch("/upload-avatar", protect, clearCache("auth_user"), uploadAvatar);

router.patch(
  "/update-user",
  protect,
  validateFormData(validateUserSchema),
  clearCache("auth_user"),
  updateUser
);

router.patch(
  "/update-password",
  rateLimiter,
  protect,
  validateFormData(updatePasswordSchema),
  clearCache("auth_user"),
  updateUserPassword
);

router.delete(
  "/delete-account",
  protect,
  clearCache("auth_user"),
  deleteAccount
);

export default router;
