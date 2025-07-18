import axiosInstance from "@/shared/utils/axiosInstance";
import { tryCatchFn } from "@/shared/utils/constants";

const getHeaders = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const createUser = tryCatchFn(async (userData, accessToken) => {
  const response = await axiosInstance.post(
    "/api/v1/user/create",
    userData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const getAllUsers = async ({ request, accessToken }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "";
  const sort = searchParams.get("sort") || "";
  const response = await axiosInstance.get(
    `/api/v1/user/all?page=${page}&limit=${limit}&query=${query}&role=${role}&sort=${sort}`,
    getHeaders(accessToken)
  );
  return response.data;
};

export const updateUserRole = tryCatchFn(
  async (userId, userData, accessToken) => {
    const response = await axiosInstance.patch(
      `/api/v1/user/${userId}/update`,
      userData,
      getHeaders(accessToken)
    );
    return response.data;
  }
);

export const deleteUser = tryCatchFn(async (userId, accessToken) => {
  const response = await axiosInstance.delete(
    `/api/v1/user/${userId}/delete`,
    getHeaders(accessToken)
  );
  return response.data;
});
