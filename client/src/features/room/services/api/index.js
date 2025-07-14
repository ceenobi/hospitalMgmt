import axiosInstance from "@/shared/utils/axiosInstance";

export const getRoomMeta = async () => {
  const response = await axiosInstance.get("/api/v1/room/meta");
  return response.data;
};

export const createRoom = async (roomData) => {
  try {
    const response = await axiosInstance.post("/api/v1/room/create", roomData);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const getAllRooms = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const roomType = searchParams.get("roomType") || "";
  const roomStatus = searchParams.get("roomStatus") || "";
  const sort = searchParams.get("sort") || "";
  const response = await axiosInstance.get(
    `/api/v1/room/all?page=${page}&limit=${limit}&query=${query}&roomType=${roomType}&roomStatus=${roomStatus}&sort=${sort}`
  );
  return response.data;
};

export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/room/${roomId}/update`,
      roomData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/room/${roomId}/delete`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};
