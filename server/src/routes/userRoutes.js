import express from "express";
import { validateFormData } from "../middelwares/validateFormData.js";
import { protect, authorizedRoles } from "../middelwares/authenticate.js";
import { cacheMiddleware, clearCache } from "../middelwares/cache.js";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "../controllers/userController.js";
import {
  validateSignUpSchema,
  validateUpdateUserRoleSchema,
} from "../utils/dataSchema.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  authorizedRoles("admin"),
  validateFormData(validateSignUpSchema),
  clearCache("users"),
  createUser
);

router.get("/all", protect, cacheMiddleware("users", 3600), getAllUsers);

router.patch(
  "/:id/update",
  protect,
  authorizedRoles("admin"),
  validateFormData(validateUpdateUserRoleSchema),
  clearCache("users"),
  updateUserRole
);

router.delete(
  "/:id/delete",
  protect,
  authorizedRoles("admin"),
  clearCache("users"),
  deleteUser
);

export default router;
