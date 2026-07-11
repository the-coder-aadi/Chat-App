import express from "express"
import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js"
const accesscheck = express.Router()
accesscheck.post("/access-check",accesscheckmiddleware,(req,res)=>{
        res.json({
    success:true,
    msg:"access token is valid"
})

})
export default accesscheck