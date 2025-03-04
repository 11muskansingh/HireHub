import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import {
  postCompany,
  updateCompany,
  getCompanyById,
  getUserCompanies,
} from "../controllers/company.controllers.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/postcompany").post(verifyFirebaseToken, postCompany);
router
  .route("/:companyId")
  .put(verifyFirebaseToken, upload.single("file"), updateCompany);

router.route("/c/:companyId").get(verifyFirebaseToken, getCompanyById);

router.route("/getCompanies").get(verifyFirebaseToken, getUserCompanies);
export default router;
