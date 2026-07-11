import express from "express"
import validator from "../middlewares/expressvalidation.js"
import signupmiddleware from "../middlewares/signupmiddleware.js"
import usermodel from "../models/usermodel.js"
import { body } from "express-validator"
import bcrypt from "bcrypt"
import notificationmodel from "../models/notification.js"
const signuprouter = express.Router()
signuprouter.post("/createacc",
    [
  body("name").notEmpty().withMessage("please fill namne").trim(),
  body("email").notEmpty().withMessage("please fill email").isEmail("invalid email formate").trim(),
  body("pass").notEmpty().withMessage("please fill pass").isStrongPassword().withMessage("keep pass strong").trim()
    ],
    validator,signupmiddleware,
    async(req,res)=>{
const hashed = await bcrypt.hash(req.body.pass, 10)
      const newuser =  await usermodel.create({
            name:req.body.name,
            email:req.body.email,
            pass: hashed
        })

        const allusers = await usermodel.find({
    _id: { $ne: newuser._id }
})


// sabko notification bhejo
for(let user of allusers){
    await notificationmodel.create({
        receiverId: user._id,
        senderId: newuser._id,
        type: "join",
        text: `${newuser.name} joined NexChat`
    })
}


// khud ko welcome notification
await notificationmodel.create({
    receiverId: newuser._id,
    senderId: newuser._id,
    type: "welcome",
    text: "Welcome to NexChat 🎉"
})

        res.json({
            success:true,
            name:req.body.name
        })

})
export default signuprouter