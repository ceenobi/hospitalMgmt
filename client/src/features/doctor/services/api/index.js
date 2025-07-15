import axiosInstance from "@/shared/utils/axiosInstance";
import { tryCatchFn } from "@/shared/utils/constants";

export const register = tryCatchFn(async (doctorData) => {
  const response = await axiosInstance.post(
    "/api/v1/doctor/register",
    doctorData
  );
  return response.data;
});

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

export const updateDoctor = tryCatchFn(async (doctorId, doctorData) => {
  const response = await axiosInstance.patch(
    `/api/v1/doctor/${doctorId}/update`,
    doctorData
  );
  return response.data;
});

export const deleteDoctor = tryCatchFn(async (doctorId) => {
  const response = await axiosInstance.delete(
    `/api/v1/doctor/${doctorId}/delete`
  );
  return response.data;
});
