import {v2 as cloudinary} from 'cloudinary';
import { error } from 'console';
import fs from "fs";



// User uploads image
//         ↓
// Frontend sends image to backend
//         ↓
// Backend receives file using Multer
//         ↓
// Backend uploads file to Cloudinary
//         ↓
// Cloudinary stores image
//         ↓
// Cloudinary returns image URL
//         ↓
// Backend saves URL in MongoDB

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadFileOnCloudinary = async(localfilepath) =>{
    try{
        if(!localfilepath){
            console.log("localfile path not found");
            throw new Error("Local file path is required for uploading to Cloudinary");
        }
         const response = await cloudinary.v2.uploader.upload(localfilepath,{
            resource_type: "auto", // auto detect the file type
        });
        console.log("File uploaded successfully to Cloudinary");
        console.log("Cloudinary response:", response.url);
        fs.unlinkSync(localfilepath);
        return response;    
        
    }
    catch(error){
        console.error("Error uploading file to Cloudinary:", error);
        fs.unlinkSync(localfilepath); // Delete the local file after upload attempt
        throw error; // Rethrow the error to be handled by the caller 
    }
}


export default uploadFileOnCloudinary;

