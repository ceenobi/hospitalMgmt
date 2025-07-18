import {
  bookAppointment,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "../api";

export const appointmentAction = async ({ request, accessToken }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const method = request.method;
  if (method === "POST") {
    if (data.type === "book") {
      const res = await bookAppointment(data, accessToken);
      return res;
    } else {
      const res = await createAppointment(data, accessToken);
      return res;
    }
  }
  if (method === "PATCH") {
    const res = await updateAppointment(data.appointmentId, data, accessToken);
    return res;
  }
  if (method === "DELETE") {
    const res = await deleteAppointment(data.appointmentId, accessToken);
    return res;
  }
  return null;
};
