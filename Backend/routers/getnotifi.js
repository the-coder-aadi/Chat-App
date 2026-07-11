import express from "express"
import notificationmodel from "../models/notification.js"
import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js"

const router = express.Router()

router.get("/notifications", accesscheckmiddleware, async(req,res)=>{
   const myId = req.user.id

   const notifications = await notificationmodel.find({
      receiverId: myId
   }).sort({ createdAt: -1 })

   res.json({
      success:true,
      notifications
   })
})

export default router