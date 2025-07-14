import Room from "../models/room.js";
import { roomType, roomStatus, roomInfo } from "../utils/constants.js";
import { sortRoomMethods } from "../utils/sortMethods.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const roomService = {
  createRoom: async (roomData, next) => {
    const roomExists = await Room.findOne({ roomNumber: roomData.roomNumber });
    if (roomExists) {
      return next(errorResponse("Room number already exists", 400));
    }
    const room = await Room.create({
      ...roomData,
    });
    return room;
  },
  getRoomMeta: async () => {
    const roomMeta = {
      roomType,
      roomStatus,
      roomInfo,
    };
    return roomMeta;
  },
  getAllRooms: async (
    page = 1,
    limit = 20,
    query = "",
    roomType = "",
    roomStatus = "",
    sort = "",
    next
  ) => {
    const sanitizeQuery = query.toLowerCase().replace(/[^\w+-]/gi, "");
    const [rooms, total] =
      sanitizeQuery || roomType || roomStatus
        ? await Promise.all([
            Room.find({
              $or: [
                {
                  roomDescription: { $regex: sanitizeQuery, $options: "i" },
                },
              ],
              ...(roomType && { roomType: roomType }),
              ...(roomStatus && { roomStatus: roomStatus }),
            })
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Room.countDocuments({
              $or: [
                {
                  roomDescription: { $regex: sanitizeQuery, $options: "i" },
                },
              ],
              ...(roomType && { roomType: roomType }),
              ...(roomStatus && { roomStatus: roomStatus }),
            }),
          ])
        : await Promise.all([
            Room.find()
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Room.countDocuments(),
          ]);
    if (!rooms) {
      return next(notFoundResponse("No rooms found"));
    }
    const sortedRooms = sort ? rooms.sort(sortRoomMethods[sort].method) : rooms;
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + rooms.length < total,
        limit,
      },
      rooms: sortedRooms,
    };
  },
  updateRoom: async (roomId, roomData, next) => {
    const room = await Room.findById(roomId);
    if (!room) {
      return next(notFoundResponse("No room found"));
    }
    for (const [key, value] of Object.entries(roomData)) {
      if (value) {
        room[key] = value;
      }
    }
    const updatedRoom = await room.save();
    return updatedRoom;
  },
  deleteRoom: async (roomId, next) => {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return next(notFoundResponse("No room found"));
    }
    return true;
  },
};

export default roomService;
