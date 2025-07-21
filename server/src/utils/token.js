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
  if (user) {
    const token = signToken(user._id);
    const cookieOptions = {
      // maxAge: 7 * 24 * 60 * 60 * 1000,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/api/v1/auth/refresh-token",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? "hospital-mgmt-care.vercel.app"
          : undefined,
    };
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      cookieOptions,
    };
  }
};
