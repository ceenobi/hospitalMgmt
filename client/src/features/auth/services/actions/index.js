import {
  deleteAccount,
  getPasswordResetToken,
  login,
  logout,
  refreshToken,
  register,
  resendVerifyToken,
  resetPassword,
  updateUser,
  updateUserPassword,
  uploadAvatar,
  verifyAccount,
} from "../api";
// import { jwtDecode } from "jwt-decode";

export const registerAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const res = await register(data);
  return res;
};

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const res = await login(data);
  return res;
};

export const getPasswordResetTokenAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const res = await getPasswordResetToken(data);
  return res;
};

export const resetPasswordAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const res = await resetPassword(data);
  return res;
};

export const verifyAccountAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const method = request.method;
  if (method === "POST") {
    const res = await resendVerifyToken();
    return res;
  }
  if (method === "PATCH") {
    const res = await verifyAccount(data);
    return res;
  }
};

export const logoutAction = async ({ setAccessToken }) => {
  const res = await logout({});
  setAccessToken(null);
  return res;
};

export const updateAccountAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (data.title === "account") {
    const res = await updateUser(data);
    return res;
  }
  if (data.title === "avatar") {
    const res = await uploadAvatar(data);
    return res;
  }
  if (request.method === "DELETE") {
    const res = await deleteAccount();
    return res;
  }
  return null;
};

export const updatePasswordAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const res = await updateUserPassword(data);
  return res;
};

export const refreshTokenAction = async ({ setAccessToken }) => {
  const res = await refreshToken(setAccessToken);
  return res;
};

// export const setupTokenRefresh = async (accessToken, setAccessToken) => {
//   if (!accessToken) return;
//   try {
//     const decodedToken = jwtDecode(accessToken);
//     const expirationTime = decodedToken?.exp ?? 0;
//     const currentTime = Date.now();
//     const timeUntilExpiry = expirationTime * 1000 - currentTime;
//     const refreshBuffer = 2 * 60 * 1000;
//     const timeUntilRefresh = timeUntilExpiry - refreshBuffer;

//     if (timeUntilRefresh <= 0) {
//       try {
//         const res = await refreshToken();
//         setAccessToken(res?.data?.accessToken);
//       } catch (error) {
//         if (import.meta.env.DEV) {
//           console.error(error);
//         }
//       }
//     } else {
//       const refreshTimer = setTimeout(async () => {
//         try {
//           const res = await refreshToken();
//           setAccessToken(res?.data?.accessToken);
//         } catch (error) {
//           if (import.meta.env.DEV) {
//             console.error(error);
//           }
//         }
//       }, timeUntilRefresh);

//       return () => clearTimeout(refreshTimer);
//     }
//   } catch (error) {
//     if (import.meta.env.DEV) {
//       console.error("Error setting up token refresh:", error);
//     }
//     setAccessToken("");
//   }
// };
