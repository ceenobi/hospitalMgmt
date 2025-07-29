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
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: isProduction,
    path: "/api/v1/auth/refresh-token",
    sameSite: isProduction ? "none" : "lax",
    // Remove domain or set it dynamically based on the request
    // domain: isProduction ? ".yourdomain.com" : undefined,
  };

  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    cookieOptions,
  };
};
