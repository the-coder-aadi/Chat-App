import usermodel from "../models/usermodel.js";
import bcrypt from "bcrypt"
async function loginmiddleware(req,res,next) {
    const finduser = await usermodel.findOne({
        email:req.body.email,
    })

if (!finduser) {
    return res.json({
        success:false,
        msg:"user not found"
    })
}
const ismatch = await bcrypt.compare(
    req.body.pass,
    finduser.pass
)
if (!ismatch) {
    return res.json({
        success:false,
        msg:"invalid password"
    })
}
req.data = finduser
next()

}
export default loginmiddleware