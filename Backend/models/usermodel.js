import mongoose from "mongoose";
const userschema = new mongoose.Schema(
{
name:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
     unique: true,
      lowercase: true,
},
pass: {
    type: String,
    default: null
},
googleId: {
    type: String,
    default: null
},
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },


},
  { timestamps: true }
)
const usermodel = mongoose.model("users", userschema)
export default usermodel