import { deleteDoctor, register, updateDoctor } from "../api";

export const doctorAction = async ({ request, accessToken }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const method = request.method;
  if (method === "POST") {
    const res = await register(data, accessToken);
    return res;
  }
  if (method === "PATCH") {
    const res = await updateDoctor(data.doctorId, data, accessToken);
    return res;
  }
  if (method === "DELETE") {
    const res = await deleteDoctor(data.doctorId, accessToken);
    return res;
  }
  return null;
};
