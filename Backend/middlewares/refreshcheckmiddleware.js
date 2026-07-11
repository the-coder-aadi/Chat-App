import jwt from "jsonwebtoken"
function refreshtokencheckmiddleware(req,res,next) {
    const token = req.cookies["refresh-token"]
    if (!token) {
        return res.json({
            success:false,
            msg:"refresh token is not found"
        })
    }
    const verify = jwt.verify(token, process.env.REFRESH_TOKEN)
    req.data = verify
    next()
}
export default refreshtokencheckmiddleware