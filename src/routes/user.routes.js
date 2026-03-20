import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { logInUser, logOutUser,refreshAccessToken, UpdateAccountDetails} from "../controllers/user.controller.js";

const router = Router();
// hpps://localhost/8000/users/register
router.route("/register").post(
    upload.fields([
        {name: "avatar", maxCount: 1},
        {name: "images", maxCount: 1}
    ]),
    registerUser) // we have given a controller in its input 
router.route("/login").post(logInUser)
router.route("/logout").post(verifyJWT,logOutUser) // we will clear the refresh token from the database and also clear the cookie from the frontend
router.route("/refresh-token").post(refreshAccessToken) // to refresh the access token when the session gets end
export default router;

router.route("/change-password").post(verifyJWT, changePassword) // to change the password of the user
router.route("/current-user").post(verifyJWT, getCurrentUser) // to get the current user details
router.route("/watch-history").post(verifyJWT, getWatchHistory) // to get the watch history of the user
router.route("/update-account").patch(verifyJWT, UpdateAccountDetails) // to update the account details of the user
// this upload thingy is done so that multer reads these files and save them into the project directory with these names and then it can be accessed in the controller with req.files and then we can upload these files to cloudinary and get the url and then save that url in the database instead of saving the file itself in the database which is not a good practice.  

router.route("/avatar").post(verifyJWT, upload.single("avatar"), updateAvatar) // to update the avatar of the user
router.route("/cover-image").post(verifyJWT, upload.single("coverimage"), updateCoverImage) // to update the cover image of the user

router.route("/c/:username").get(verifyJWT,getUserChannelProfile) // to get the user details by username

router.route("/watch-history").post(verifyJWT, getWatchHistory) // to get the watch history of the user