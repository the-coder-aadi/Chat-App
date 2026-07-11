import express from "express"
import loginmiddleware from "../middlewares/loginmiddleware.js"
import validator from "../middlewares/expressvalidation.js"
import jwt from "jsonwebtoken"
import { body } from "express-validator"
import usermodel from "../models/usermodel.js"
import notificationmodel from "../models/notification.js"
const loginrouter = express.Router()
loginrouter.post("/logindata",
    [
  body("email").notEmpty().withMessage("please fill email").isEmail("invalid email formate").trim(),
  body("pass").notEmpty().withMessage("please fill pass").trim()
    ],validator, loginmiddleware,
    async(req,res)=>{

        const allusers = await usermodel.find({
   _id: { $ne: req.data._id }
})

for(let user of allusers){
   await notificationmodel.create({
      receiverId: user._id,
      senderId: req.data._id,
      type: "online",
      text: `${req.data.name} is online`
   })
}


const Access =  jwt.sign(
    {id:req.data._id, name:req.data.name},
    process.env.ACCESS_TOKEN,
    {expiresIn:"1d"}
)
const Refresh =  jwt.sign(
    {id:req.data._id, name:req.data.name},
    process.env.REFRESH_TOKEN,
    {expiresIn:"10d"}
)

   res.cookie("refresh-token", Refresh, {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : "lax",

    maxAge: 10 * 24 * 60 * 60 * 1000
})

res.json({
    success:true,
    token: Access,
    msg:"login successfully done",
    userid:req.data._id,
    username:req.data.name
})

})
export default loginrouter
