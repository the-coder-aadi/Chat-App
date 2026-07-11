import express from "express"
import Message from "../models/Message.js"
import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js"
const fetchmsgs = express.Router()
fetchmsgs.post("/msgdata/:id",accesscheckmiddleware,async(req,res)=>{
const receiverId = req.params.id
const senderId = req.user.id
const msgs = await Message.find({
    $or:[
        {senderId:senderId, receiverId:receiverId},
        {senderId:receiverId, receiverId:senderId}
    ]
}).sort({ createdAt: 1 })
res.json({
    success:true,
    msgs:msgs
})
})
export default fetchmsgs
