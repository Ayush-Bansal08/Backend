import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { logInUser, logOutUser,refreshAccessToken } from "../controllers/user.controller.js";
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

// this upload thingy is done so that multer reads these files and save them into the project directory with these names and then it can be accessed in the controller with req.files and then we can upload these files to cloudinary and get the url and then save that url in the database instead of saving the file itself in the database which is not a good practice.  