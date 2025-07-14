import {
  deleteAccount,
  getPasswordResetToken,
  login,
  logout,
  register,
  resendVerifyToken,
  resetPassword,
  updateUser,
  updateUserPassword,
  uploadAvatar,
  verifyAccount,
} from "../api";

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

export const logoutAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const res = await logout(data);
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
