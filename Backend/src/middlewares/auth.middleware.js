import { ApiError } from "../utils/Apierrors.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { admin } from "../utils/FirebaseAdmin.js";

//res is not used inside the function so can be replaced with a underscore
const verifyFirebaseToken = asynchandler(async (req, _, next) => {
  try {
    // console.log("Getting token from cookies");
    // console.log("Cookies received:", req.cookies);
    const aToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //console.log("The token is ", aToken);

    if (!aToken) throw new ApiError("401", "Unauthorised Access");

    const decodedToken = await admin.auth().verifyIdToken(aToken);
    if (!decodedToken) throw new ApiError("401", "Unauthorised Access");
    // console.log("The decoded Token is ", decodedToken);
    const firebaseUserEmail = decodedToken.email;

    let user = await User.findOne({ email: firebaseUserEmail });
    if (!user) {
      throw new ApiError(401, "User not found");
    }
    // console.log("The user is ", user);clear
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyFirebaseToken };
