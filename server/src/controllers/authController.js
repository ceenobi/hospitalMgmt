import authService from "../services/auth.service.js";
import { createSendToken } from "../utils/token.js";
import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
const { successResponse } = responseHandler;

export const signup = tryCatchFn(async (req, res, next) => {
  const user = await authService.register(req.validatedData, next);
  const { accessToken, refreshToken, cookieOptions } = createSendToken(user);
  res.cookie("clinicareRfToken", refreshToken, cookieOptions);
  return successResponse(res, { accessToken }, "Registration successfull", 201);
});

export const signin = tryCatchFn(async (req, res, next) => {
  const user = await authService.login(req.validatedData, next);
  const { accessToken, refreshToken, cookieOptions } = createSendToken(user);
  res.cookie("clinicareRfToken", refreshToken, cookieOptions);
  return successResponse(
    res,
    { accessToken },
    `Welcome back ${user.fullname}!`,
    200
  );
});

export const refreshToken = tryCatchFn(async (req, res, next) => {
  const { clinicareRfToken: token } = req.cookies;
  const user = await authService.refreshToken(token, next);
  const { accessToken, refreshToken, cookieOptions } = createSendToken(user);
  res.cookie("clinicareRfToken", refreshToken, cookieOptions);
  return successResponse(
    res,
    { accessToken },
    "Refresh token successfull",
    200
  );
});

export const verifyAccount = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await authService.verifyAccount(
    { userId, ...req.validatedData },
    next
  );
  successResponse(res, responseData, "Account verified successfully", 200);
});

export const resendVerificationToken = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await authService.resendVerificationToken(userId, next);
  return successResponse(
    res,
    responseData,
    "Verification code sent successfully",
    200
  );
});

export const getPasswordResetToken = tryCatchFn(async (req, res, next) => {
  const responseData = await authService.getPasswordResetToken(
    req.validatedData,
    next
  );
  return successResponse(
    res,
    responseData,
    "Password reset token sent successfully",
    200
  );
});

export const resetPassword = tryCatchFn(async (req, res, next) => {
  const email = req.query.email || "";
  const passwordResetToken = req.query.token || "";
  const responseData = await authService.resetPassword(
    { ...req.validatedData, email, passwordResetToken },
    next
  );
  return successResponse(res, responseData, "Password reset successfully", 200);
});

export const logout = tryCatchFn(async (req, res, next) => {
  const responseData = await authService.logout(req, res, next);
  return successResponse(res, responseData, "Logged out successfully", 200);
});

export const getUser = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await authService.getUser(userId, next);
  successResponse(res, responseData, "User found successfully", 200);
});

export const uploadAvatar = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await authService.uploadAvatar(
    userId,
    req.body.avatar,
    next
  );
  return successResponse(res, responseData, "Image uploaded successfully", 200);
});

export const updateUser = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await authService.updateUser(
    userId,
    req.validatedData,
    next
  );
  return successResponse(res, responseData, "User updated successfully", 200);
});

export const updateUserPassword = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await authService.updateUserPassword(
    userId,
    req.validatedData,
    next
  );
  return successResponse(
    res,
    responseData,
    "User password updated successfully",
    200
  );
});

export const deleteAccount = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await authService.deleteAccount(userId, next);
  return successResponse(
    res,
    responseData,
    "User account deleted successfully",
    200
  );
});
