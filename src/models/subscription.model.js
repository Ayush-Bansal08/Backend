import { Schema } from "mongoose"
import mongoose from "mongoose"

const SubscriptionSchema = new Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // the one who is the susbscriber
        ref: "User",
        required: true
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId, // the one who is the channel
        ref: "User",
        required: true
    },

},{timestamps:true})

export const subscriptionModel = mongoose.model("Subscription", SubscriptionSchema)