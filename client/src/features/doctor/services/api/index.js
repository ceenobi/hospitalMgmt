import axiosInstance from "@/shared/utils/axiosInstance";

export const register = async (doctorData) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/doctor/register",
      doctorData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const getAllUserCollections = async () => {
  const response = await axiosInstance.get("/api/v1/doctor/meta");
  return response.data;
};

export const getDoctors = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const specialization = searchParams.get("specialization") || "";
  const availability = searchParams.get("availability") || "";
  const response = await axiosInstance.get(
    `/api/v1/doctor?page=${page}&limit=${limit}&query=${query}&specialization=${specialization}&availability=${availability}`
  );
  return response.data;
};

export const updateDoctor = async (doctorId, doctorData) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/doctor/${doctorId}/update`,
      doctorData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const deleteDoctor = async (doctorId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/doctor/${doctorId}/delete`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};
