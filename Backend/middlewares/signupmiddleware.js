import usermodel from "../models/usermodel.js";
async function signupmiddleware(req,res,next) {
const finduser = await usermodel.findOne({
    email:req.body.email
})
if (finduser) {
    return res.json({
        success:false,
        msg:"user already exist"
    })
}
next()

}
export default signupmiddleware