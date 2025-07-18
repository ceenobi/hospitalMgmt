import axiosInstance from "@/shared/utils/axiosInstance";
import { tryCatchFn } from "@/shared/utils/constants";

let userCache = null;

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
  userCache = null;
  return response.data;
});

export const refreshToken = tryCatchFn(async (setAccessToken) => {
  const response = await axiosInstance.post("/api/v1/auth/refresh-token", {
    withCredentials: true,
  });
  console.log("response", response);
  const newAccessToken = response.data.data.accessToken;
  setAccessToken(newAccessToken);
  return newAccessToken;
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
  userCache = null;
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
  if (userCache) {
    return userCache;
  }
  try {
    const response = await axiosInstance.get(
      "/api/v1/auth/user",
      getHeaders(accesstoken)
    );
    userCache = response.data;
    return response.data;
  } catch (error) {
    userCache = null;
    import.meta.env.DEV && console.error(error);
  }
});

export const uploadAvatar = tryCatchFn(async (avatar, accessToken) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/upload-avatar",
    avatar,
    getHeaders(accessToken)
  );
  userCache = null;
  return response.data;
});

export const updateUser = tryCatchFn(async (userData, accessToken) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/update-user",
    userData,
    getHeaders(accessToken)
  );
  userCache = null;
  return response.data;
});

export const updateUserPassword = tryCatchFn(async (userData, accessToken) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/update-password",
    userData,
    getHeaders(accessToken)
  );
  userCache = null;
  return response.data;
});

export const deleteAccount = async (accessToken) => {
  const response = await axiosInstance.delete(
    "/api/v1/auth/delete-account",
    getHeaders(accessToken)
  );
  userCache = null;
  return response.data;
};
