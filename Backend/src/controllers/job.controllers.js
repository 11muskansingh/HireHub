import { Job } from "../models/job.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";

const postJob = asynchandler(async (req, res) => {
  console.log("posting job");
  console.log("Req.body is ", req.body);
  const {
    description,
    title,
    requirements,
    salary,
    experience,
    location,
    jobType,
    companyId,
    position,
  } = req.body;
  if (
    !description ||
    !title ||
    !requirements ||
    !salary ||
    !experience ||
    !location ||
    !jobType ||
    !companyId ||
    !position
  ) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("Got all the data");
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  console.log("User", user);

  // const newCompany = await Company.findById(companyId);
  // if (!newCompany) {
  //   throw new ApiError(400, "Company not found");
  // }
  // console.log("Company", newCompany);

  const newJob = await Job.create({
    description: description,
    title: title,
    requirements: requirements,
    salary: Number(salary),
    experienceLevel: experience,
    location: location,
    jobType: jobType,
    position: position,
    company: companyId,
    created_by: req.user._id,
  }); // Create a new job

  if (!newJob) {
    throw new ApiError(400, "Job not created");
  }
  console.log("New jOB", newJob);
  return res
    .status(200)
    .json(new ApiResponse(200, newJob, "Job created Successfully"));
});

const getAllJobs = asynchandler(async (req, res) => {
  const keyword = req.query.keyword || "";
  const query = {
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  };
  const jobs = await Job.find(query)
    .populate({
      path: "company",
    })
    .sort({ createdAt: -1 });
  if (!jobs) {
    throw new ApiError(404, "No jobs found");
  }

  return res.status(200).json(new ApiResponse(200, jobs, "All jobs"));
});

// const getJobById = asynchandler(async (req, res) => {
//   const jobId = req.params.id;
//   const job = await Job.findById(jobId).populate({
//     path: "applications",
//   });
//   if (!job) {
//     throw new ApiError(404, "Job not found");
//   }
//   return res.status(200).json(new ApiResponse(200, job, "Job"));
// });

const getJobById = asynchandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id).populate({
    path: "applications",
  });
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  return res.status(200).json(new ApiResponse(200, job, "Job"));
});

const getAdminJobs = asynchandler(async (req, res) => {
  //console.log("first");
  //console.log("My user is", req);
  const adminId = req.user._id;
  //console.log("Admin id", adminId);
  const jobs = await Job.find({ created_by: adminId }).populate({
    path: "company",
    model: "Company",
    match: {}, // Ensures it tries to populate even if null
  });
  // console.log("populated jobs", jobs);
  if (!jobs) {
    return new ApiError(500, "Jobs not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Admin Jobs Fetched Successfully"));
});

export { postJob, getAllJobs, getJobById, getAdminJobs };
