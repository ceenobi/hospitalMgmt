import { createUser, updateUserRole, deleteUser } from "../api";

export const userAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const method = request.method;
  if (method === "POST") {
    const res = await createUser(data);
    return res;
  }
  if (method === "PATCH") {
    const res = await updateUserRole(data.userId, data);
    return res;
  }
  if (method === "DELETE") {
    const res = await deleteUser(data.userId);
    return res;
  }
  return null;
};
