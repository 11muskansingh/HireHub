import { ApiError } from "../utils/Apierrors.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { admin } from "../utils/FirebaseAdmin.js";

//res is not used inside the function so can be replaced with a underscore
const verifyFirebaseToken = asynchandler(async (req, _, next) => {
  try {
    console.log("Getting token from cookies");
    console.log("Cookies received:", req.cookies);
    const aToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("The token is ", aToken);

    if (!aToken) throw new ApiError("401", "Unauthorised Access");

    const decodedToken = await admin.auth().verifyIdToken(aToken);
    console.log(decodedToken);
    const firebaseUserId = decodedToken.uid;

    let user = await User.findOne({ firebaseUserId });
    if (!user) {
      // Create a new user in MongoDB if not exists
      user = await User.create({
        firebaseUserId,
        email: decodedToken.email,
        fullname: decodedToken.name,
        phoneNumber: "",
        role: "",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyFirebaseToken };
