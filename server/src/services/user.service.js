import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { welcomeUserTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";
import { sendMail } from "../utils/mail.js";
import { sortUserMethods } from "../utils/sortMethods.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const hashedPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

const userService = {
  createUser: async (userData, next) => {
    const emailExists = await User.findOne({ email: userData.email });
    if (emailExists) {
      return next(errorResponse("Email already exists", 400));
    }
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiry = new Date(Date.now() + 3600000);
    const hashedPass = await hashedPassword(userData.password);
    const user = await User.create({
      ...userData,
      password: hashedPass,
      verificationToken: verificationCode,
      verificationTokenExpiry: verificationCodeExpiry,
    });
    const html = welcomeUserTemplate(
      userData.fullname,
      userData.password,
      verificationCode
    );
    await sendMail({
      to: user.email,
      subject: "Verify your account",
      html,
    });
    if (!user) {
      return next(errorResponse("User registration failed"));
    }
    return user;
  },
  getAllUsers: async (
    page = 1,
    limit = 20,
    query = "",
    role = "",
    sort = "",
    next
  ) => {
    const sanitizeQuery =
      query || role
        ? (query || role).toLowerCase().replace(/[^\w\s]/gi, "")
        : "";
    const [users, total] = sanitizeQuery
      ? await Promise.all([
          User.find({
            $or: [
              { fullname: { $regex: sanitizeQuery, $options: "i" } },
              { role: { $regex: sanitizeQuery, $options: "i" } },
            ],
            ...(role && {
              role: role,
            }),
          })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
          User.countDocuments({
            $or: [
              { fullname: { $regex: sanitizeQuery, $options: "i" } },
              { role: { $regex: sanitizeQuery, $options: "i" } },
            ],
          }),
        ])
      : await Promise.all([
          User.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
          User.countDocuments(),
        ]);
    if (!users) {
      return next(notFoundResponse("No users found"));
    }
    const sortedusers = sort ? users.sort(sortUserMethods[sort].method) : users;
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + users.length < total,
        limit,
      },
      users: sortedusers,
    };
  },
  updateUserRole: async (userId, userData, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found"));
    }
    for (const [key, value] of Object.entries(userData)) {
      if (value) {
        user[key] = value;
      }
    }
    const updatedUser = await user.save();
    return updatedUser;
  },
  deleteUser: async (userId, next) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return next(notFoundResponse("No user found"));
    }
    return true;
  },
};

export default userService;
