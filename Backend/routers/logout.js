import express from "express"
const logoutrouter = express.Router()
logoutrouter.post("/logout",(req,res)=>{
 res.clearCookie("refresh-token")
 res.json({
    success:true,
    msg:"logout ho gyaaaaa"
 })
})
export default logoutrouter