import axiosInstance from "@/shared/utils/axiosInstance";
import { tryCatchFn } from "@/shared/utils/constants";

const getHeaders = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const getRoomMeta = async (accessToken) => {
  const response = await axiosInstance.get(
    "/api/v1/room/meta",
    getHeaders(accessToken)
  );
  return response.data;
};

export const createRoom = tryCatchFn(async (roomData, accessToken) => {
  const response = await axiosInstance.post(
    "/api/v1/room/create",
    roomData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const getAllRooms = async ({ request, accessToken }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const roomType = searchParams.get("roomType") || "";
  const roomStatus = searchParams.get("roomStatus") || "";
  const sort = searchParams.get("sort") || "";
  const response = await axiosInstance.get(
    `/api/v1/room/all?page=${page}&limit=${limit}&query=${query}&roomType=${roomType}&roomStatus=${roomStatus}&sort=${sort}`,
    getHeaders(accessToken)
  );
  return response.data;
};

export const updateRoom = tryCatchFn(async (roomId, roomData, accessToken) => {
  const response = await axiosInstance.patch(
    `/api/v1/room/${roomId}/update`,
    roomData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const deleteRoom = tryCatchFn(async (roomId, accessToken) => {
  const response = await axiosInstance.delete(
    `/api/v1/room/${roomId}/delete`,
    getHeaders(accessToken)
  );
  return response.data;
});
