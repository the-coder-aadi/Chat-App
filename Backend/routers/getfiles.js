
import express from "express"
import Message from "../models/Message.js"
import upload from "./multer.js"
import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js"
const getfiles = express.Router()

getfiles.post("/send-file",accesscheckmiddleware,upload.single("file"), async(req,res)=>{
const { senderId, receiverId } = req.body;
       const newMsg = await Message.create({
      senderId,
      receiverId,
      fileUrl: req.file.path,
      fileType: req.file.mimetype
    });

    const receiverSocketId = global.onlineUsers[receiverId];

if(receiverSocketId){

    global.io.to(receiverSocketId).emit("receive-file",{

        id:newMsg._id,

        senderId,

        receiverId,

        file:req.file.path,

        fileType:req.file.mimetype,

        createdAt:newMsg.createdAt

    });

}

res.json({
    success:true,
    msg:"your file uploaded in cloudinary",
    id:newMsg._id,
    fileUrl: req.file.path
})
})
export default getfiles
