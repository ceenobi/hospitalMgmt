import axiosInstance from "@/utils/axiosInstance";
import { tryCatchFn } from "@/utils/constants";

const getHeaders = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const register = tryCatchFn(async (userData) => {
  const response = await axiosInstance.post("/api/v1/auth/signup", userData);
  return response.data;
});

export const login = tryCatchFn(async (userData) => {
  const response = await axiosInstance.post(`/api/v1/auth/signin`, userData);
  return response.data;
});

export const logout = tryCatchFn(async () => {
  const response = await axiosInstance.post(
    "/api/v1/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
});

export const refreshToken = tryCatchFn(async () => {
  const response = await axiosInstance.post("/api/v1/auth/refresh-token", {
    withCredentials: true,
  });
  return response.data;
});

export const getPasswordResetToken = tryCatchFn(
  async (userData, accessToken) => {
    const response = await axiosInstance.post(
      "/api/v1/auth/get-password-reset-token",
      userData,
      getHeaders(accessToken)
    );
    return response.data;
  }
);

export const resetPassword = tryCatchFn(async (userData, accessToken) => {
  const response = await axiosInstance.patch(
    `/api/v1/auth/reset-password?email=${userData.email}&token=${userData.token}`,
    userData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const verifyAccount = tryCatchFn(async (userData, accessToken) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/verify-account",
    userData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const resendVerifyToken = async (accessToken) => {
  const response = await axiosInstance.post(
    "/api/v1/auth/resend-verify-token",
    {},
    getHeaders(accessToken)
  );
  return response.data;
};

export const authUser = tryCatchFn(async (accesstoken) => {
  if (!accesstoken) return null;
  const response = await axiosInstance.get(
    "/api/v1/auth/user",
    getHeaders(accesstoken)
  );
  return response.data;
});

export const uploadAvatar = tryCatchFn(async (avatar, accessToken) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/upload-avatar",
    avatar,
    getHeaders(accessToken)
  );
  return response.data;
});

export const updateUser = tryCatchFn(async (userData, accessToken) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/update-user",
    userData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const updateUserPassword = tryCatchFn(async (userData, accessToken) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/update-password",
    userData,
    getHeaders(accessToken)
  );
  return response.data;
});

export const deleteAccount = async (accessToken) => {
  const response = await axiosInstance.delete(
    "/api/v1/auth/delete-account",
    getHeaders(accessToken)
  );
  return response.data;
};
