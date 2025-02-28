import { Company } from "../models/company.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

const postCompany = asynchandler(async (req, res) => {
  const { companyName } = req.body;
  if (!companyName) {
    throw new ApiError(400, "Company name is required.");
  }
  let company = await Company.findOne({ name: companyName });
  if (company) {
    throw new ApiError(409, "Company already exists.");
  }

  company = await Company.create({
    name: companyName,
    userId: req.user?._id,
  });

  const currUser = await User.findByIdAndUpdate(
    req.user._id,
    { "profile.company": company._id },
    { new: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, company, "Company created successfully."));
});

const updateCompany = asynchandler(async (req, res) => {
  const { description, website, location } = req.body;
  console.log("files", req.file);
  const { logo } = req.file;

  if (!description || !website || !location)
    throw new ApiError(401, "All the fields are required");

  let logoURL;
  if (logo) {
    const logoResponse = await uploadonCloudinary(logo);
    logoURL = logoResponse?.secure_URL;
  }
  const updatedData = { description, website, location, logoURL };
  const { companyId } = req.params;

  const updatedCompany = await Company.findByIdAndUpdate(companyId, {
    $set: updatedData,
  });

  if (!updatedCompany)
    throw new ApiError(500, "Unable to Update the file Details");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCompany,
        "Company Details Updated Successfully"
      )
    );
});

const getCompanyById = asynchandler(async (req, res) => {
  const { companyId } = req.params;
  if (!companyId) throw new ApiError(401, "Company id is Required");

  const company = await Company.findById(companyId);
  if (!company) throw new ApiError(400, "Unable to fetch the company");

  return res
    .status(200)
    .json(new ApiResponse(200, company, "Fetched Company Successfully"));
});

const getUserCompanies = asynchandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "UserId is Required");

  const user = await User.findById(userId).populate("profile.company").lean();
  if (!user) throw new ApiError(401, "User Not Found");

  const companies = await Company.find({ userId: user._id }).lean();
  if (!companies) throw new ApiError("401", "Unable to fetch companies");

  return res
    .status(200)
    .json(new ApiResponse(200, companies, "Companies fetched Successfully"));
});

export { postCompany, updateCompany, getCompanyById, getUserCompanies };
