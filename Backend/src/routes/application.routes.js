import { Router } from "express";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  statusUpdate,
} from "../controllers/application.controllers.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/allApplicants/:id").get(verifyFirebaseToken, getApplicants);
router.route("/apply/:id").post(verifyFirebaseToken, applyJob);
router.route("/applied").get(verifyFirebaseToken, getAppliedJobs);
router.route("/update/:id").post(verifyFirebaseToken, statusUpdate);

export default router;
