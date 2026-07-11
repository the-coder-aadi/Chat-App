import jwt from "jsonwebtoken"
function accesscheckmiddleware(req,res, next) {
    const token = req.headers.authorization
    if (!token) {
        return res.json({
            success:false,
            msg:"access token is not found"
        })
    }
    const verify = jwt.verify(token, process.env.ACCESS_TOKEN)
req.user = verify
    next()
}
export default accesscheckmiddleware