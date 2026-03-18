import { userModel } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async (req,res,next)=>{
   try{
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized request"
        })
    }
    // if token is there then we will verify it
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user =  await userModel.findById(decodedToken._id).select("-password -refreshToken")
    if(!user){
        return res.status(401).json({
            success: false,
            message: "Unauthorized request"
        })
    }


    req.user = user // we will have the access of user in the req object in the next middlewares and controllers
    next() // move to the next middleware or controller
}catch(error){
    console.error("Error in verifying JWT", error)
    return res.status(401).json({
        success: false,
        message: "Unauthorized request"
    })
}


})
