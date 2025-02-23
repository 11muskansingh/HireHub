import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registeruser,
  loginUser,
  logOutUser,
  updateProfile,
} from "../controllers/user.controllers.js";
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
router.route("/login").post(loginUser);
router.route("/logout").post(verifyFirebaseToken, logOutUser);
router.route("/updateProfile").put(
  verifyFirebaseToken,
  upload.fields([
    {
      name: "resume",
      maxCount: 1,
    },
    {
      name: "profilePhoto",
      maxCount: 1,
    },
  ]),
  updateProfile
);
export default router;
