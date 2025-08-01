import jwt from "jsonwebtoken";

export const signToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });
  return { accessToken, refreshToken };
};

export const createSendToken = (user) => {
  if (!user) return null;
  const token = signToken(user._id);
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    maxAge: 5 * 60 * 1000, //5 minutes
    httpOnly: true,
    secure: isProduction,
    path: "/",
    sameSite: isProduction ? "none" : "lax",
  };

  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    cookieOptions,
  };
};
