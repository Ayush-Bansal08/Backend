import mongoose from "mongoose";    
import dotenv from "dotenv";
import { databaseName } from "../constants.js";

dotenv.config();
const connectDb = async ()=>{
    try{
       const calling =await mongoose.connect(`${process.env.MONGODB_URI}/${databaseName}`);
       console.log(`connected to data base ${calling.connection.host} successfully`);

    }
    catch(error){
        console.error("Error connecting to MongoDB failed:", error);
        process.exit(1); // Exit the process with an error code
    }   
}


export default connectDb;