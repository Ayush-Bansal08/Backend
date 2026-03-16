import { asyncHandler } from "../utils/asyncHandler.js";
import {userModel} from "../models/user.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(  async(req,res)=>{
   // get user details from frontend(postman)
   // validation of user details- not empty, email format, password strength
   // check if user already exists in database
   // if user exists, send error response
   // check for imgaes
   // check for avataar
   // upload them to cloudinary and get the url
   // create user in database with the details and url of images- user object
   // remove password and refrehs token field from response
   // check for user creation in db
   // return response to frontend with success message and user details without password and refresh token
    const {username, email, fullname, password} = req.body
    console.log(username, email, fullname, password);

        if(!username || !email || !fullname || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // check if the username or password already exists
      const existedUser = await userModel.findOne({$or: [{username}, {email}]})
      if(existedUser) {
            return res.status(409).json({
                success: false,
                message: "User with email or username already exists"
            });
        }

      const avatarLocalPath = req.files.avatar[0]?.path; // we have dfined the path in the multer itself
      const imagesLocalPath = req.files.images[0]?.path;

      if(!avatarLocalPath || !imagesLocalPath) {
        return res.status(400).json({
            success: false,
            message: "Avatar and images are required and the path is not available"
        });
      }

     const avataarDB= await uploadFileOnCloudinary(avatarLocalPath)
     const coverImageDB = await uploadFileOnCloudinary(imagesLocalPath)
        if(!avataarDB || !coverImageDB) {
            return res.status(500).json({
                success: false,
                message: "Error in uploading files to cloudinary"
            });
        }

        // now i am giving all thsis data to mongoose(USER) to store the data
        const user = await userModel.create({
            username: username.toLowerCase(),
            email,
            avatar: avataarDB.url,
            images: coverImageDB.url,
            fullname,
             
})

const createdUser=await userModel.findById(user._id).select("-password -refreshToken") // we dont want to send the password and refresh token in the response

if(!createdUser){
    return res.status(500).json({ 
        success: false,
        message: "Error in creating user in database"
    });
}
    console.log("User registered successfully", createdUser);

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully", true)
)



})
export {registerUser}