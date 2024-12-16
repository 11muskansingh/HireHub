import mongoose from "mongoose";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const registeruser = asynchandler(async (req, res) => {
  const { fullname, email, phoneNumber, password, role } = req.body;

  if (!fullname) throw new ApiError(400, "FullName is required");
  if (!email) throw new ApiError(400, "Email is required");
  if (!phoneNumber) throw new ApiError(400, "Phone Number is required");
  if (!password) throw new ApiError(400, "Password is required");
  if (!role) throw new ApiError(400, "Password is required");

  const existedUser = await User.findOne({
    $or: [{ phoneNumber }, { email }],
  });
  console.log(existedUser);
  if (existedUser)
    throw new ApiError(
      409,
      "User with Phone number or username already exists"
    );
  const newUser = await User.create({
    fullname,
    email,
    password,
    phoneNumber,
    role,
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  console.log(createdUser);
  if (!createdUser) throw new ApiError(500, "Not able to Register the user");
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    createdUser._id
  );
  const options = {
    secure: true,
    sameSite: "None",
    httpOnly: true,
  };
  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "SuccessFull Registration"));
});
export { register };

const generateAccessandRefreshTokens = async (userid) => {
  try {
    const user = await User.findById(userid);

    const accessToken = await user.generateAccessTokens();
    if (!accessToken) throw new ApiError(500, "can't generate token");
    const refreshToken = await user.generateRefreshTokens();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new ApiError(400, "Email is required");
  if (!password) throw new ApiError(400, "password is required");

  const currentUser = await User.findOne({ email });
  console.log("current user :", currentUser);
  if (!currentUser) throw new ApiError(400, "Unknown User");

  const correctPassword = await currentUser.isPasswordCorrect(password);
  if (!correctPassword)
    throw new ApiError(400, "Please enter correct password");

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    currentUser._id
  );

  const options = {
    secure: true,
    sameSite: "None",
    httpOnly: true,
  };

  const updatedloggedinUser = await User.findById(currentUser._id).select(
    "-password -refreshTokens"
  );
  console.log(updatedloggedinUser);
  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedloggedinUser, "Logged In SuccessFully"));
});

export { registeruser, loginUser };
