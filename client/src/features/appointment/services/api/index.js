import axiosInstance from "@/shared/utils/axiosInstance";
import { tryCatchFn } from "@/shared/utils/constants";

const getHeaders = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};
export const getAppointmentMeta = tryCatchFn(async (accessToken) => {
  const headers = getHeaders(accessToken);
  const response = await axiosInstance.get("/api/v1/appointment/meta", headers);
  return response.data;
});
export const bookAppointment = tryCatchFn(
  async (appointmentData, accessToken) => {
    const response = await axiosInstance.post(
      "/api/v1/appointment/book",
      appointmentData,
      getHeaders(accessToken)
    );
    return response?.data;
  }
);
export const createAppointment = tryCatchFn(
  async (appointmentData, accessToken) => {
    const response = await axiosInstance.post(
      "/api/v1/appointment/create",
      appointmentData,
      getHeaders(accessToken)
    );
    return response.data;
  }
);
export const getAllAppointments = async ({ request, accessToken }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const time = searchParams.get("time") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const response = await axiosInstance.get(
    `/api/v1/appointment/all?page=${page}&limit=${limit}&query=${query}&status=${status}&time=${time}&startDate=${startDate}&endDate=${endDate}`,
    getHeaders(accessToken)
  );
  return response.data;
};
export const getPatientAppointments = async ({ request, accessToken }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const time = searchParams.get("time") || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const response = await axiosInstance.get(
    `/api/v1/appointment/patient?page=${page}&limit=${limit}&query=${query}&status=${status}&time=${time}&startDate=${startDate}&endDate=${endDate}`,
    getHeaders(accessToken)
  );
  return response.data;
};
export const updateAppointment = tryCatchFn(
  async (appointmentId, appointmentData, accessToken) => {
    const response = await axiosInstance.patch(
      `/api/v1/appointment/${appointmentId}/update`,
      appointmentData,
      getHeaders(accessToken)
    );
    return response.data;
  }
);
export const deleteAppointment = tryCatchFn(
  async (appointmentId, accessToken) => {
    const response = await axiosInstance.delete(
      `/api/v1/appointment/${appointmentId}/delete`,
      getHeaders(accessToken)
    );
    return response.data;
  }
);
