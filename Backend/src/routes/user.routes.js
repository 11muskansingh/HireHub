import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registeruser, loginUser } from "../controllers/user.controllers.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
  ]),
  registeruser
);

export default router;
