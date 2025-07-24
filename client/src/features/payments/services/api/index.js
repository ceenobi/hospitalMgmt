import axiosInstance from "@/utils/axiosInstance";
import { tryCatchFn } from "@/utils/constants";

const getHeaders = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const createPayment = tryCatchFn(async (paymentData, accessToken) => {
  const response = await axiosInstance.post(
    "/api/v1/payment/create",
    paymentData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const getAllPayments = async ({ request, accessToken }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const sort = searchParams.get("sort") || "";
  const response = await axiosInstance.get(
    `/api/v1/payment/all?page=${page}&limit=${limit}&query=${query}&status=${status}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`,
    getHeaders(accessToken)
  );
  return response.data;
};
