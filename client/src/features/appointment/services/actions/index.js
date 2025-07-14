import {
  bookAppointment,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "../api";

export const appointmentAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const method = request.method;
  if (method === "POST") {
    if (data.type === "book") {
      const res = await bookAppointment(data);
      return res;
    } else {
      const res = await createAppointment(data);
      return res;
    }
  }
  if (method === "PATCH") {
    const res = await updateAppointment(data.appointmentId, data);
    return res;
  }
  if (method === "DELETE") {
    const res = await deleteAppointment(data.appointmentId);
    return res;
  }
  return null;
};
