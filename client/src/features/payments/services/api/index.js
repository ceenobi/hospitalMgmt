import axiosInstance from "@/shared/utils/axiosInstance";
import { tryCatchFn } from "@/shared/utils/constants";

const getHeaders = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const createPayment = tryCatchFn(
  async (paymentData, accessToken) => {
    const response = await axiosInstance.post(
      "/api/v1/payment/create",
      paymentData,
      getHeaders(accessToken)
    );
    return response.data;
  }
);
