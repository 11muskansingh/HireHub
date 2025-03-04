import { Router } from "express";
import { applyJob } from "../controllers/application.controllers.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/apply/:id").post(verifyFirebaseToken, applyJob);

export default router;
