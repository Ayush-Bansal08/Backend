import { asyncHandler } from "../utils/asyncHandler.js";
import {userModel} from "../models/user.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


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


const logInUser = asyncHandler(async (req,res)=> { 
   // take email and password from frontend
   // find the user in database with email
   // chekc the password
   //  access and refrsh token generation and send to user(generated in user model)
   // send cookie 
   // send response to frontend with success message and user details without password and refresh token
   const {email,username, password} = req.body
    if(!email && !password && !username) {
        return res.status(400).json({
            success: false,
            message: "Email, username and password are required"
        });
    }

    // find in database
   const user = await userModel.findOne({
        $or: [{username},{email}]
    })
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found with this email or username"
        });
    }

    // now chekc if the password given is correct or not 
    // we have given this password fromt he frontend to check now this mehtod we have created in the usermodel so it will check if this matches it or not and it will return true or false
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        return res.status(401).json({
            success: false,
            message: "Invalid password"
        });
    }

//fucntion for giving reffresh and access tokens

const generateAccessAndRefreshTokens = async (userId) => {
    try {
       const user = await userModel.findById(userId); // here wehave user userModel and not user because we are taking general case
       const accesToken = user.generateAccessToken() // we have created this method in the user model
       const refreshToken = user.generateRefreshToken() // we have created this method in the user model  
       user.refreshToken = refreshToken // we are storing the refresh token in the database for the user
      await user.save({validateBeforeSave: false}) // we are saving the user with the refresh token in the database
      return {accesToken, refreshToken} // we are returning the access token and refresh token to the frontend



       }    
        catch (error) { 
            console.error("Error generating tokens:", error);
            throw new Error("Error generating tokens");
        }   
     
}



    const {accesstoken,refreshtoken} =await generateAccessAndRefreshTokens(user._id)

    const loggedinUser = await userModel.findById(user._id).select("-password -refreshToken") // we dont want to send the password and refresh token in the response \

    // now to send the cookie 
    const cookieOptions = {
        httpOnly: true, // to prevent client side js from accessing the cookie
        secure: true, // to send cookie only on https
    }


    return res.status(200).cookie("refreshToken", refreshtoken, cookieOptions).
    cookie("accesstoken", accesstoken, cookieOptions).json({
        success: true,
        message: "User logged in successfully",
        user: loggedinUser, accesstoken,refreshtoken
    })   


})

const logOutUser = asyncHandler(async (req,res)=>{
    //now we will clear the refresh token from the database and also clear the cookie from the frontend
    const userId = req.user._id // we have the access of user in the req object because we have used the verifyJWT middleware in the route
    await userModel.findByIdAndUpdate(userId, { 
        $set: { refreshToken: null }, new : true})
        
        
        const options = {  
            httpOnly: true,
            secure: true,
        }
        

   return res.status(200).clearCookie("refreshToken", options).clearCookie("accesstoken", options). json({
        success: true,
        message: "User logged out successfully"
    })
})

// now to refresh the access token when the session gets end 

const refreshAccessToken = asyncHandler(async (req,res)=>{
  try {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshtoken
    if(!incomingrefreshToken){
      return res.status(401).json({
          success: false,
          message: "Refresh token not found"
      })
    }
  
   const decodedToken=jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)
   const user = await userModel.findById(decodedToken._id)
   if(!user){
      return res.status(401).json({
          success: false,
          message: "Invalid refresh token"
      })
   }
   if(user.refreshToken !== incomingrefreshToken){
      return res.status(401).json({
          success: false,
          message: "Invalid refresh token, you are fraud"
      })
   }
  
   const option = {
      secure: true,
      httpOnly: true
   }
  
   const newgeneration = await generateAccessAndRefreshTokens(user._id)
  
   return res.status(200).cookie("refreshToken", newgeneration.refreshtoken, option).cookie("accesstoken", newgeneration.accesstoken, option).json({
      success: true,
      message: "Access token refreshed successfully",
      accesstoken: newgeneration.accesstoken,
      refreshtoken: newgeneration.refreshtoken
   })
  } catch (error) {
    console.error("Error refreshing access token", error)
    return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
    })
    
  }

  


})
export {registerUser, logInUser, logOutUser, refreshAccessToken}