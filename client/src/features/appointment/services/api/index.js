import axiosInstance from "@/shared/utils/axiosInstance";

export const getAppointmentMeta = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/appointment/meta");
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const bookAppointment = async (appointmentData) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/appointment/book",
      appointmentData
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/appointment/create",
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const getAllAppointments = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const time = searchParams.get("time") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const response = await axiosInstance.get(
    `/api/v1/appointment/all?page=${page}&limit=${limit}&query=${query}&status=${status}&time=${time}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const getPatientAppointments = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const time = searchParams.get("time") || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const response = await axiosInstance.get(
    `/api/v1/appointment/patient?page=${page}&limit=${limit}&query=${query}&status=${status}&time=${time}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/appointment/${appointmentId}/update`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/appointment/${appointmentId}/delete`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};
