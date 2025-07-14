import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
import userService from "../services/user.service.js";
const { successResponse } = responseHandler;

export const createUser = tryCatchFn(async (req, res, next) => {
  const user = await userService.createUser(req.validatedData, next);
  successResponse(res, user.fullname, "User created successfully", 201);
});

export const getAllUsers = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, role, sort } = req.query;
  const responseData = await userService.getAllUsers(
    parseInt(page),
    parseInt(limit),
    query,
    role,
    sort,
    next
  );
  successResponse(res, responseData, "Users data fetched successfully", 200);
});

export const updateUserRole = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.params;
  const responseData = await userService.updateUserRole(
    userId,
    req.validatedData,
    next
  );
  successResponse(res, responseData, "User updated successfully", 200);
});

export const deleteUser = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.params;
  const responseData = await userService.deleteUser(userId, next);
  successResponse(res, responseData, "User deleted successfully", 200);
});
