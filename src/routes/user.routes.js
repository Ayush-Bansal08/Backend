import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
// hpps://localhost/8000/users/register
router.route("/register").post(
    upload.fields([
        {name: "avatar", maxCount: 1},
        {name: "images", maxCount: 1}
    ]),
    registerUser) // we have given a controller in its input 

export default router;

// this upload thingy is done so that multer reads these files and save them into the project directory with these names and then it can be accessed in the controller with req.files and then we can upload these files to cloudinary and get the url and then save that url in the database instead of saving the file itself in the database which is not a good practice. 