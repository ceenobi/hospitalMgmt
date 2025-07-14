import { register, updatePatient, deletePatient } from "../api";

export const patientAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const method = request.method;
  if (method === "POST") {
    const res = await register(data);
    return res;
  }
  if (method === "PATCH") {
    const res = await updatePatient(data.patientId, data);
    return res;
  }
  if (method === "DELETE") {
    const res = await deletePatient(data.patientId);
    return res;
  }
  return null;
};
