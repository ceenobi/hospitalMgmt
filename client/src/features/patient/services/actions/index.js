import { register, updatePatient, deletePatient } from "../api";

export const patientAction = async ({ request, accessToken }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const method = request.method;
  if (method === "POST") {
    const res = await register(data, accessToken);
    return res;
  }
  if (method === "PATCH") {
    const res = await updatePatient(data.patientId, data, accessToken);
    return res;
  }
  if (method === "DELETE") {
    const res = await deletePatient(data.patientId, accessToken);
    return res;
  }
  return null;
};
