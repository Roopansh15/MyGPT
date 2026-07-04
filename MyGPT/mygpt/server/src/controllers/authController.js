import bcrypt from "bcryptjs";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const sendAuthResponse = (res, statusCode, user) => {
  res.status(statusCode).json({
    token: generateToken(user._id),
    user
  });
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError("Name, email, and password are required", 400);
  }

  if (password.length < 6) {
    throw new ApiError("Password must be at least 6 characters", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError("An account with that email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash
  });

  sendAuthResponse(res, 201, user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");

  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new ApiError("Invalid email or password", 401);
  }

  sendAuthResponse(res, 200, user);
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
