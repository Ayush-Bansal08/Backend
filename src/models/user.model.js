import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        index: true
    },
    email: {    
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
        
    },
    avatar: {
        type: String, // cloudinary url
        default: null
    },
    coverimage: {
        type: String, // cloudinary url
    },
    watchHistory: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    refreshToken: {
        type: String,
        default: null
    }
},{timestamps:true})



UserSchema.pre("save",async function (){
    if(!this.isModified("password")){
         return ;
    } // check if the password is modified or not
    this.password = await bcrypt.hash(this.password, 10) // move to the next step in the save process
})



UserSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password) // compare the password with the hashed password
}

UserSchema.methods.generateAccessToken = function (){
     return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME})
}
UserSchema.methods.generateRefreshToken = function (){
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME})
}

export const userModel = mongoose.model("User", UserSchema)