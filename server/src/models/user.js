import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    dateOfBirth: {
      type: Date,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarId: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "nurse", "staff", "admin"],
      default: "patient",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetTokenExpiry: {
      type: Date,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    isCompletedOnboard: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ fullname: 1 });
userSchema.index({ role: 1 });

userSchema.pre("save", function (next) {
  this.lastLoginAt = Date.now();
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  this.lastLoginAt = Date.now();
  next();
});

const User = mongoose.models.User || model("User", userSchema);
export default User;
