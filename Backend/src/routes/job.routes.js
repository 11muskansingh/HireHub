import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  postJob,
  getAllJobs,
  getJobById,
} from "../controllers/job.controllers.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/postjob").post(verifyFirebaseToken, postJob);
router.route("/all").get(getAllJobs);
router.route("/:id").get(verifyFirebaseToken, getJobById);

export default router;
