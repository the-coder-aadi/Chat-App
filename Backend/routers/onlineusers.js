import express from "express"
import redis from "../redis.js"
import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js"
const Onlineusers = express.Router()
Onlineusers.get("/onlineusers",accesscheckmiddleware,async(req,res)=>{
const keys = await redis.keys("online:*")
  console.log("redis keys:", keys)
const onlineuserids = keys.map((key)=> key.split(":")[1])
res.json({
    success:true,
    userids: onlineuserids
})
})
export default Onlineusers