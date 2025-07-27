import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, //one who is subscribing
    ref: "User",
    required: true,
  },
  channel:{
    type: mongoose.Schema.Types.ObjectId, //one to whom subscriber is subscribing
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    enum: ["free", "premium"],
    default: "free",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
},{timestamps: true});


export const Subscription = mongoose.model("Subscription", subscriptionSchema);