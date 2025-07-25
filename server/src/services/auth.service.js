import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mail.js";
import {
  passwordResetTemplate,
  resendVerificationTemplate,
  welcomeUserTemplate,
} from "../utils/emailTemplates.js";
import crypto from "crypto";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const hashedPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

const authService = {
  register: async (userData, next) => {
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
      role: "patient",
    });
    const html = welcomeUserTemplate(userData.fullname, verificationCode);
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
  login: async (userData, next) => {
    const { email, password } = userData;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(errorResponse("Incorrect email or password", 401));
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(errorResponse("Incorrect email or password", 401));
    }
    return user;
  },
  refreshToken: async (token, next) => {
    if (!token) {
      return next(errorResponse("Refresh token required", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(errorResponse("Invalid refresh token", 401));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(errorResponse("Invalid refresh token", 401));
    }
    return user;
  },
  verifyAccount: async (userData, next) => {
    const { userId, verificationToken } = userData;
    const user = await User.findOne({ _id: userId }).select(
      "+verificationToken +verificationTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    if (!user.verificationTokenExpiry) {
      return next(notFoundResponse("Verification code not found"));
    }
    if (user.isVerified) {
      return next(errorResponse("Email is already verified", 400));
    }
    if (user.verificationToken !== verificationToken) {
      return next(errorResponse("Invalid verification code", 400));
    }

    if (user.verificationTokenExpiry < new Date()) {
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
      return next(errorResponse("Verification code has expired", 400));
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    return user;
  },
  resendVerificationToken: async (userId, next) => {
    const user = await User.findOne({ _id: userId }).select(
      "+verificationToken +verificationTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    if (user.isVerified) {
      return next(errorResponse("Email is already verified", 400));
    }
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
    user.verificationToken = verificationCode;
    user.verificationTokenExpiry = verificationCodeExpiry;
    await user.save();

    const html = resendVerificationTemplate(user.fullname, verificationCode);

    try {
      await sendMail({
        to: user.email,
        subject: "Verify your account",
        html,
      });
    } catch (err) {
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
      return next(
        errorResponse(
          "There was an error sending the email. Please try again later!"
        )
      );
    }
    return user;
  },
  getPasswordResetToken: async (userData, next) => {
    const { email } = userData;
    const user = await User.findOne({ email });
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    const resetToken = crypto.randomInt(100000, 999999).toString();
    const resetTokenExpiry = new Date(Date.now() + 900000); // 15 minutes
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = resetTokenExpiry;
    await user.save();

    const html = passwordResetTemplate(user.fullname, user.email, resetToken);

    try {
      await sendMail({
        to: user.email,
        subject: "Reset your password",
        html,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
      await user.save();
      return next(
        errorResponse(
          "There was an error sending the email. Please try again later!"
        )
      );
    }
    return user;
  },
  resetPassword: async (userData, next) => {
    const { email, password, passwordConfirm, passwordResetToken } = userData;
    if (password !== passwordConfirm) {
      return next(errorResponse("Passwords do not match", 400));
    }
    const user = await User.findOne({ email }).select(
      "+password +passwordResetToken +passwordResetTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    if (
      !user.passwordResetToken ||
      user.passwordResetToken !== passwordResetToken
    ) {
      return next(errorResponse("Password reset token not found", 400));
    }
    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (isPasswordSame) {
      return next(
        errorResponse("New password must be different from old password", 400)
      );
    }
    if (user.passwordResetTokenExpiry < new Date()) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
      await user.save();
      return next(errorResponse("Password reset token has expired", 400));
    }
    const hashedPass = await hashedPassword(password);
    user.password = hashedPass;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();
    return user;
  },
  logout: async (req, res, next) => {
    res.cookie("clinicareUserRefreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/v1/auth/refresh-token",
    });
    return true;
  },
  getUser: async (userId, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    return user;
  },
  uploadAvatar: async (userId, avatar, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    if (!avatar) {
      return next(errorResponse("No file uploaded", 400));
    }
    const currentAvatar = user.avatar;
    const currentAvatarId = user.avatarId;
    if (currentAvatar) {
      await deleteFromCloudinary(currentAvatarId);
    }
    const { url, public_id } = await uploadToCloudinary(avatar, {
      folder: "Clinicare/avatars",
      width: 200,
      height: 200,
      crop: "fit",
      format: "webp",
    });
    user.avatar = url || user.avatar;
    user.avatarId = public_id || user.avatarId;
    await user.save();
    return user;
  },
  updateUser: async (userId, userData, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    for (const [key, value] of Object.entries(userData)) {
      if (value) {
        user[key] = value;
      }
    }
    const updatedUser = await user.save();
    return updatedUser;
  },
  updateUserPassword: async (userId, userData, next) => {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    const { password, newPassword, confirmPassword } = userData;
    const [checkPassword, isPasswordSame] = await Promise.all([
      bcrypt.compare(password, user.password),
      bcrypt.compare(newPassword, user.password),
    ]);
    if (!checkPassword) {
      return next(errorResponse("Incorrect current password", 400));
    }
    if (newPassword !== confirmPassword) {
      return next(errorResponse("Passwords do not match", 400));
    }
    if (isPasswordSame) {
      return next(
        errorResponse("New password must be different from old password", 400)
      );
    }
    const hashedPass = await hashedPassword(newPassword);
    user.password = hashedPass;
    const updatedUser = await user.save();
    return updatedUser;
  },
  deleteAccount: async (userId, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    if (user.avatarId) {
      await deleteFromCloudinary(user.avatarId);
    }
    // const patient = await Patient.findOneAndDelete({ userId });
    // const doctor = await Doctor.findOneAndDelete({ userId });
    await user.deleteOne();
    return true;
  },
};

export default authService;
