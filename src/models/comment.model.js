import mongoose from "mongoose";
import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CommentSchema = new Schema({
   content: {
    type: String,
    required: true
   },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",    
    }

},{timestamps:true})


CommentSchema.plugin(mongooseAggregatePaginate)

export const commentmodel = mongoose.model("Comment", CommentSchema)