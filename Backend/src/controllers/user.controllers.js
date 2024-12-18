import mongoose from "mongoose";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

//Register Controller
const registeruser = asynchandler(async (req, res) => {
  const { fullname, email, phoneNumber, password, role } = req.body;
  const profilePhoto = req.files?.profilePhoto;

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

  let profilePhotoUrl = "";

  if (profilePhoto && profilePhoto.length > 0) {
    const profilePhotoResponse = await uploadonCloudinary(profilePhoto);
    profilePhotoUrl = profilePhotoResponse.secure_url;
  }

  const newUser = await User.create({
    fullname,
    email,
    password,
    phoneNumber,
    role,
    profile: {
      profilePhoto: profilePhotoUrl,
    },
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

const logOutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User LoggedOut SuccessFully"));
});

const updateProfile = asynchandler(async (req, res) => {
  const { fullname, bio, phoneNumber, email, skills } = req.body;

  const updateData = {};
  if (fullname) updateData.fullname = fullname;
  if (email) updateData.email = email;
  if (bio) updateData["profile.bio"] = bio;
  if (phoneNumber) updateData.phoneNumber = phoneNumber;
  if (skills) updateData["profile.skills"] = skills.split(",");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        updateData,
      },
    },
    {
      new: true,
    }
  );
});

const updateResumeAndProfilePhoto = asynchandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { resume, profilePhoto } = req.files;
  const updates = {};

  // Upload resume file to Cloudinary
  if (resume && resume.length > 0) {
    const resumeResponse = await uploadonCloudinary(resume);
    updates["profile.resume"] = resumeResponse.secure_url;
    updates["profile.resumeOriginalName"] = resume[0].originalname;
  }

  // Upload profile photo to Cloudinary
  if (profilePhoto && profilePhoto.length > 0) {
    const profilePhotoResponse = await uploadonCloudinary(profilePhoto);
    updates["profile.profilePhoto"] = profilePhotoResponse.secure_url;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  );

  if (!user) {
    throw new ApiError(500, "Unable to Update the details");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Details Updated Successfully"));
});

export {
  registeruser,
  loginUser,
  logOutUser,
  updateProfile,
  updateResumeAndProfilePhoto,
};
