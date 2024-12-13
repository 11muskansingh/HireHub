import mongoose from "mongoose";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";
import { asynchandler } from "../utils/asynchandler.js";

const registeruser = asynchandler(async (req, res) => {
  const { fullname, email, phoneNumber, password, role } = req.body;

  if (!fullname) throw new ApiError(400, "FullName is required");
  if (!email) throw new ApiError(400, "Email is required");
  if (!phoneNumber) throw new ApiError(400, "Phone Number is required");
  if (!password) throw new ApiError(400, "Password is required");
  if (!role) throw new ApiError(400, "Password is required");
});
export { register };
