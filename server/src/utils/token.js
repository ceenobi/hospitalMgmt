import jwt from "jsonwebtoken";

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const createSendToken = (user, res) => {
  if (user) {
    const token = signToken(user._id);
    const cookieOptions = {
      // maxAge: 7 * 24 * 60 * 60 * 1000,
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/", // Cookie is accessible on all paths
      sameSite: "strict", // Prevent CSRF attacks
    };
    res.cookie("jwt", token, cookieOptions);
  }
};
