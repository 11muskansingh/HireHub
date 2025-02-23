import mongoose from "mongoose";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";
import { asynchandler } from "../utils/asynchandler.js";
//import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";
import axios from "axios";

//Register Controller
const registeruser = asynchandler(async (req, res) => {
  const { fullname, email, password, role, profilePhotoUrl } = req.body;
  // console.log("Req.files : ", req.files);
  const profilePhoto = req.files?.profilePhoto;

  // console.log("Incoming request data:", req.body);
  // console.log("Profile photo:", profilePhoto);

  if (!fullname) throw new ApiError(400, "FullName is required");
  if (!email) throw new ApiError(400, "Email is required");
  // if (!phoneNumber) throw new ApiError(400, "Phone Number is required");
  if (!password && !req.body.googleSignUp)
    throw new ApiError(400, "Password is required");
  if (!role) throw new ApiError(400, "Password is required");

  console.log("Searching existing user");
  const existedUser = await User.findOne({
    email,
  });
  console.log(`Existing User: ${existedUser}`);
  if (existedUser) throw new ApiError(409, "User with username already exists");

  let finalProfilePhotoUrl = "";
  console.log("Starting to upload the image");
  console.log(`GoogleSignUp: ${req.body.googleSignUp}`);
  console.log(`ProfilePhoto: ${profilePhoto}`);
  if (req.body.googleSignUp && profilePhotoUrl) {
    // If signing up with Google, use the provided photo URL
    finalProfilePhotoUrl = profilePhotoUrl;
  } else if (profilePhoto) {
    console.log("Uploading to cloudinary...");
    const profilePhotoResponse = await uploadonCloudinary(profilePhoto);
    finalProfilePhotoUrl = profilePhotoResponse?.secure_url;
  }

  console.log(`ProfilePhoto: ${profilePhotoUrl}`);
  const userPassword = password || crypto.randomBytes(16).toString("hex");

  const newUser = await User.create({
    fullname,
    email,
    password: userPassword,
    role,
    profile: {
      profilePhoto: finalProfilePhotoUrl,
    },
  });
  if (!newUser) console.log("User not created");
  console.log(newUser);

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  console.log(createdUser);
  // if (!createdUser) throw new ApiError(500, "Not able to Register the user");
  // const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
  //   createdUser._id
  // );
  // const options = {
  //   secure: true,
  //   sameSite: "None",
  //   httpOnly: true,
  // };
  // res
  //   .cookie("accessToken", accessToken, options)
  //   .cookie("refreshToken", refreshToken, options);
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "SuccessFull Registration"));
});

// const generateAccessandRefreshTokens = async (userid) => {
//   try {
//     const user = await User.findById(userid);

//     const accessToken = await user.generateAccessTokens();
//     if (!accessToken) throw new ApiError(500, "can't generate token");
//     const refreshToken = await user.generateRefreshTokens();

//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(500, "Something went wrong while generating tokens");
//   }
// };

const loginUser = asynchandler(async (req, res) => {
  const { email, password, googleSignIn, role } = req.body;
  console.log("Incoming request data:", req.body);
  if (!email) throw new ApiError(400, "Email is required");
  if (!googleSignIn && !password)
    throw new ApiError(400, "password is required");

  console.log("Searching for the user");
  const currentUser = await User.findOne({ email });
  console.log("current user :", currentUser);

  if (!currentUser) throw new ApiError(400, "Unknown User");

  if (!googleSignIn) {
    const correctPassword = await currentUser.isPasswordCorrect(password);
    if (!correctPassword)
      throw new ApiError(400, "Please enter correct password");
  }

  if (role !== currentUser.role)
    throw new ApiError(400, "Account doesn't exist with this role");

  // const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
  //   currentUser._id
  // );

  // const options = {
  //   secure: true,
  //   sameSite: "None",
  //   httpOnly: true,
  // };

  const updatedloggedinUser = await User.findById(currentUser._id).select(
    "-password -refreshTokens"
  );
  console.log(updatedloggedinUser);
  // res
  //   .cookie("accessToken", accessToken, options)
  //   .cookie("refreshToken", refreshToken, options);

  // Ensure no circular references in the user object
  const userObject = updatedloggedinUser.toObject();
  delete userObject.__v; // Remove any unwanted fields

  return res
    .status(200)
    .json(new ApiResponse(200, updatedloggedinUser, "Logged In SuccessFully"));
});

const logOutUser = asynchandler(async (req, res) => {
  const uid = req.user._id;
  await admin.auth().revokeRefreshTokens(uid);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  };
  res.cookie("refreshToken", "", options);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User LoggedOut SuccessFully"));
});

const updateProfile = asynchandler(async (req, res) => {
  const { fullname, bio, email, skills } = req.body;
  const files = req.files;
  const updateData = {};
  if (fullname) updateData.fullname = fullname;
  if (email) updateData.email = email;
  if (bio) updateData["profile.bio"] = bio;
  if (skills) updateData["profile.skills"] = skills.split(",");

  if (files && files.resume) {
    const resumeResponse = await uploadonCloudinary(files.resume);
    updateData["profile.resume"] = resumeResponse.secure_url;
    updateData["profile.resumeOriginalName"] = files.resume[0].originalname;
  }

  if (files && files.profilePhoto) {
    const profilePhotoResponse = await uploadonCloudinary(
      files.profilePhoto[0]
    );
    updateData["profile.profilePhoto"] = profilePhotoResponse.secure_url;
  }

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

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

// const updateResumeAndProfilePhoto = asynchandler(async (req, res) => {
//   const userId = req.user?._id;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { resume, profilePhoto } = req.files;
//   const updates = {};

//   // Upload resume file to Cloudinary
//   if (resume && resume.length > 0) {
//     const resumeResponse = await uploadonCloudinary(resume);
//     updates["profile.resume"] = resumeResponse.secure_url;
//     updates["profile.resumeOriginalName"] = resume[0].originalname;
//   }

//   // Upload profile photo to Cloudinary
//   if (profilePhoto && profilePhoto.length > 0) {
//     const profilePhotoResponse = await uploadonCloudinary(profilePhoto);
//     updates["profile.profilePhoto"] = profilePhotoResponse.secure_url;
//   }

//   const user = await User.findByIdAndUpdate(
//     userId,
//     { $set: updates },
//     { new: true }
//   );

//   if (!user) {
//     throw new ApiError(500, "Unable to Update the details");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, user, "Details Updated Successfully"));
// });

export {
  registeruser,
  loginUser,
  logOutUser,
  updateProfile,
  // updateResumeAndProfilePhoto,
};
