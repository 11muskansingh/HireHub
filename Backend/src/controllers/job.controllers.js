import { Job } from "../models/job.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";

const postJob = asynchandler(async (req, res) => {
  const {
    description,
    title,
    requirements,
    salary,
    experience,
    location,
    jobType,
    company,
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
    !company ||
    !position
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  const newCompany = await Company.findOne({ name: company });
  if (!newCompany) {
    throw new ApiError(400, "Company not found");
  }

  const newJob = await Job.create({
    description: description,
    title: title,
    requirements: requirements,
    salary: Number(salary),
    experienceLevel: experience,
    location: location,
    jobType: jobType,
    position: position,
    company: newCompany._id,
    created_by: req.user._id,
  }); // Create a new job

  if (!newJob) {
    throw new ApiError(400, "Job not created");
  }
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
  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  return res.status(200).json(new ApiResponse(200, job, "Job"));
});

export { postJob, getAllJobs, getJobById };
