import axiosInstance from "@/shared/utils/axiosInstance";
import { tryCatchFn } from "@/shared/utils/constants";

export const register = tryCatchFn(async (patientData) => {
  const response = await axiosInstance.post(
    "/api/v1/patient/register",
    patientData
  );
  return response.data;
});

export const getAllPatients = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const gender = searchParams.get("gender") || "";
  const bloodGroup = searchParams.get("bloodGroup") || "";
  const sort = searchParams.get("sort") || "";
  const response = await axiosInstance.get(
    `/api/v1/patient/all?page=${page}&limit=${limit}&query=${query}&gender=${gender}&bloodGroup=${bloodGroup}&sort=${sort}`
  );
  return response.data;
};

export const getPatient = tryCatchFn(async () => {
  const response = await axiosInstance.get("/api/v1/patient/me");
  return response.data;
});

export const updatePatient = tryCatchFn(async (patientId, patientData) => {
  const response = await axiosInstance.patch(
    `/api/v1/patient/${patientId}/update`,
    patientData
  );
  return response.data;
});

export const deletePatient = tryCatchFn(async (patientId) => {
  const response = await axiosInstance.delete(
    `/api/v1/patient/${patientId}/delete`
  );
  return response.data;
});
