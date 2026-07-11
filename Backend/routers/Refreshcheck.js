import express from 'express'
import jwt from "jsonwebtoken"
import refreshtokencheckmiddleware from '../middlewares/refreshcheckmiddleware.js'
const refreshcheck = express.Router()
refreshcheck.post("/refresh-check",refreshtokencheckmiddleware,(req,res)=>{
const newaccess = jwt.sign(
    {id:req.data.id,name:req.data.name },
    process.env.ACCESS_TOKEN,
    {expiresIn:"1d"}
)
const newrefresh = jwt.sign(
    {id:req.data.id,name:req.data.name },
    process.env.REFRESH_TOKEN,
    {expiresIn:"10d"}
)
   res.cookie("refresh-token", newrefresh, {
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
    token:newaccess,
    msg:"refresh token is valid and new access token & new refresh token is created"
})
})
export default refreshcheck