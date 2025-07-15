import axiosInstance from "@/shared/utils/axiosInstance";
import { tryCatchFn } from "@/shared/utils/constants";

let userCache = null;

export const register = tryCatchFn(async (userData) => {
  const response = await axiosInstance.post("/api/v1/auth/signup", userData);
  return response.data;
});

export const login = tryCatchFn(async (userData) => {
  const response = await axiosInstance.post(`/api/v1/auth/signin`, userData);
  return response.data;
});

export const getPasswordResetToken = tryCatchFn(async (userData) => {
  const response = await axiosInstance.post(
    "/api/v1/auth/get-password-reset-token",
    userData
  );
  return response.data;
});

export const resetPassword = tryCatchFn(async (userData) => {
  const response = await axiosInstance.patch(
    `/api/v1/auth/reset-password?email=${userData.email}&token=${userData.token}`,
    userData
  );
  return response.data;
});

export const verifyAccount = tryCatchFn(async (userData) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/verify-account",
    userData
  );
  userCache = null;
  return response.data;
});

export const resendVerifyToken = async () => {
  const response = await axiosInstance.post(
    "/api/v1/auth/resend-verify-token",
    {}
  );
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post(
    "/api/v1/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
  userCache = null;
  return response.data;
};

export const authUser = async () => {
  if (userCache) {
    return userCache;
  }
  try {
    const response = await axiosInstance.get("/api/v1/auth/user");
    userCache = response.data;
    return response.data;
  } catch (error) {
    userCache = null;
    import.meta.env.DEV && console.error(error);
  }
};

export const uploadAvatar = async (avatar) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/upload-avatar",
    avatar
  );
  userCache = null;
  return response.data;
};

export const updateUser = tryCatchFn(async (userData) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/update-user",
    userData
  );
  userCache = null;
  return response.data;
});

export const updateUserPassword = tryCatchFn(async (userData) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/update-password",
    userData
  );
  userCache = null;
  return response.data;
});

export const deleteAccount = async () => {
  const response = await axiosInstance.delete("/api/v1/auth/delete-account");
  userCache = null;
  return response.data;
};
