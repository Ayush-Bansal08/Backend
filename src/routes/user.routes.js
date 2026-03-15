import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
// hpps://localhost/8000/users/register
router.route("/register").post(
    upload.fields([
        {name: "avatar", maxCount: 1},
        {name: "images", maxCount: 5}
    ]),
    registerUser) // we have given a controller in its input 

export default router;