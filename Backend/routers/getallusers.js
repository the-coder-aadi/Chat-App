import express from "express"
import usermodel from "../models/usermodel.js"
import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js"
const getallusers = express.Router()
getallusers.get("/allusers",accesscheckmiddleware,async(req,res)=>{
    const myId = req.user.id
   const allusers = await usermodel.find({ _id: { $ne: myId } })
   res.json({
    success:true,
    msg:"all users are here",
    users:allusers
   })
})
export default getallusers