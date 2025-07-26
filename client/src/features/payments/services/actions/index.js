import {
  createPayment,
  updatePayment,
  deletePayment,
  uploadReceipt,
} from "../api";

export const paymentAction = async ({ request, accessToken }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const method = request.method;
  if (method === "POST") {
    if (data.type === "create") {
      const res = await createPayment(data, accessToken);
      return res;
    }
  }
  if (method === "PATCH") {
    const res = await updatePayment(data.paymentId, data, accessToken);
    return res;
  }
  if (method === "DELETE") {
    const res = await deletePayment(data.paymentId, accessToken);
    return res;
  }
  return null;
};

export const paymentReceiptAction = async ({ request, accessToken }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (request.method === "PATCH") {
    const res = await uploadReceipt(data, accessToken);
    return res;
  }
  return null;
};
