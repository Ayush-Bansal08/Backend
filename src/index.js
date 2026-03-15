import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
import { databaseName } from "./constants.js";
import express from "express";
import {app} from "./app.js";

import connectDb from "./db/index.js";


dotenv.config();
connectDb()
.then(()=>{
    app.on("error", (error)=>{
        console.error("Error connecting to MongoDB:", error);
    });
    app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});
})
.catch((error)=>{
    console.error("Error connecting to MongoDB:", error);
});


// direct method to connect to MongoDB database using mongoose and start the server
/*
(async ()=>{
    try{
        // method to connect to MongoDB database using mongoose
        await mongoose.connect(`${process.env.MONGODB_URI}/${databaseName}`); 
        // .on checks the erros while the server is running and if there is any error it will print the error in the console
        app.on("error", (error)=>{
            console.error("Error connecting to MongoDB:", error);
        });
        app.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error);
    }
})()
    */