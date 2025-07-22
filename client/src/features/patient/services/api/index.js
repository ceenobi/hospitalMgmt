import axiosInstance from "@/utils/axiosInstance";
import { tryCatchFn } from "@/utils/constants";

const getHeaders = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const register = tryCatchFn(async (patientData, accessToken) => {
  const response = await axiosInstance.post(
    "/api/v1/patient/register",
    patientData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const getAllPatients = async ({ request, accessToken }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const gender = searchParams.get("gender") || "";
  const bloodGroup = searchParams.get("bloodGroup") || "";
  const sort = searchParams.get("sort") || "";
  const response = await axiosInstance.get(
    `/api/v1/patient/all?page=${page}&limit=${limit}&query=${query}&gender=${gender}&bloodGroup=${bloodGroup}&sort=${sort}`,
    getHeaders(accessToken)
  );
  return response.data;
};

export const getPatient = tryCatchFn(async (accessToken) => {
  const response = await axiosInstance.get("/api/v1/patient/me", getHeaders(accessToken));
  return response.data;
});

export const updatePatient = tryCatchFn(async (patientId, patientData, accessToken) => {
  const response = await axiosInstance.patch(
    `/api/v1/patient/${patientId}/update`,
    patientData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const deletePatient = tryCatchFn(async (patientId, accessToken) => {
  const response = await axiosInstance.delete(
    `/api/v1/patient/${patientId}/delete`,
    getHeaders(accessToken)
  );
  return response.data;
});
