import express from "express";
import { validateFormData } from "../middelwares/validateFormData.js";
import { protect, authorizedRoles } from "../middelwares/authenticate.js";
import { cacheMiddleware, clearCache } from "../middelwares/cache.js";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomMeta,
  updateRoom,
} from "../controllers/roomController.js";
import { validateRoomSchema } from "../utils/dataSchema.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  authorizedRoles("admin"),
  validateFormData(validateRoomSchema),
  clearCache("rooms"),
  createRoom
);

router.get(
  "/meta",
  protect,
  authorizedRoles("admin"),
  cacheMiddleware("rooms_meta", 3600),
  getRoomMeta
);

router.get("/all", protect, cacheMiddleware("rooms", 3600), getAllRooms);

router.patch(
  "/:id/update",
  protect,
  authorizedRoles("admin"),
  validateFormData(validateRoomSchema),
  clearCache("rooms"),
  updateRoom
);

router.delete(
  "/:id/delete",
  protect,
  authorizedRoles("admin"),
  clearCache("rooms"),
  deleteRoom
);

export default router;
