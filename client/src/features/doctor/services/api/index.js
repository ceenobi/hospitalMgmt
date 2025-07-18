import axiosInstance from "@/shared/utils/axiosInstance";
import { tryCatchFn } from "@/shared/utils/constants";

const getHeaders = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const register = tryCatchFn(async (doctorData, accessToken) => {
  const response = await axiosInstance.post(
    "/api/v1/doctor/register",
    doctorData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const getAllUserCollections = async (accessToken) => {
  const response = await axiosInstance.get(
    "/api/v1/doctor/meta",
    getHeaders(accessToken)
  );
  return response.data;
};

export const getDoctors = async ({ request, accessToken }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const specialization = searchParams.get("specialization") || "";
  const availability = searchParams.get("availability") || "";
  const response = await axiosInstance.get(
    `/api/v1/doctor?page=${page}&limit=${limit}&query=${query}&specialization=${specialization}&availability=${availability}`,
    getHeaders(accessToken)
  );
  return response.data;
};

export const updateDoctor = tryCatchFn(
  async (doctorId, doctorData, accessToken) => {
    const response = await axiosInstance.patch(
      `/api/v1/doctor/${doctorId}/update`,
      doctorData,
      getHeaders(accessToken)
    );
    return response.data;
  }
);

export const deleteDoctor = tryCatchFn(async (doctorId, accessToken) => {
  const response = await axiosInstance.delete(
    `/api/v1/doctor/${doctorId}/delete`,
    getHeaders(accessToken)
  );
  return response.data;
});
