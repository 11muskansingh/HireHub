import { Company } from "../models/company.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

const applyJob = asynchandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  if (!id) throw new ApiError(401, "Job Id is Required");
  const existingApplicaton = await Application.findOne({
    job: id,
    applicant: userId,
  });

  if (existingApplicaton) throw new ApiError(409, "You Have Already Applied");
  const currJob = await Job.findById(id);
  if (!currJob) throw new ApiError(400, "Job Not Found");

  const newApplication = await Application.create({
    job: id,
    applicant: userId,
  });

  if (!newApplication) throw new ApiError(401, "Unable to apply to the job");
  currJob.applications.push(newApplication._id);
  await currJob.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newApplication, "Applied Successfully"));
});
export { applyJob };
