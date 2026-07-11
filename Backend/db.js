import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const connectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODBURL)
        console.log("mongodb is connected 🥳");
        
    } catch (error) {
        console.log(error, "mongodb connect nahi hua");
        
    }
}
export default connectdb