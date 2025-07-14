import { createRoom, deleteRoom, updateRoom } from "../api";

export const roomAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const method = request.method;
  if (method === "POST") {
    const res = await createRoom(data);
    return res;
  }
  if (method === "PATCH") {
    const res = await updateRoom(data.roomId, data);
    return res;
  }
  if (method === "DELETE") {
    const res = await deleteRoom(data.roomId);
    return res;
  }
  return null;
};
