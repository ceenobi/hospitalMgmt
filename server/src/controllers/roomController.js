import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
import roomService from "../services/room.service.js";
const { successResponse } = responseHandler;

export const getRoomMeta = tryCatchFn(async (req, res, next) => {
  const roomMeta = await roomService.getRoomMeta();
  successResponse(res, roomMeta, "Room meta data fetched successfully", 200);
});

export const createRoom = tryCatchFn(async (req, res, next) => {
  const room = await roomService.createRoom(req.validatedData, next);
  successResponse(res, room.roomNumber, "Room created successfully", 201);
});

export const getAllRooms = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, roomType, roomStatus, sort } = req.query;
  const responseData = await roomService.getAllRooms(
    parseInt(page),
    parseInt(limit),
    query,
    roomType,
    roomStatus,
    sort,
    next
  );
  successResponse(res, responseData, "Rooms data fetched successfully", 200);
});

export const updateRoom = tryCatchFn(async (req, res, next) => {
  const { id: roomId } = req.params;
  const responseData = await roomService.updateRoom(
    roomId,
    req.validatedData,
    next
  );
  successResponse(res, responseData, "Room updated successfully", 200);
});

export const deleteRoom = tryCatchFn(async (req, res, next) => {
  const { id: roomId } = req.params;
  const responseData = await roomService.deleteRoom(roomId, next);
  successResponse(res, responseData, "Room deleted successfully", 200);
});
