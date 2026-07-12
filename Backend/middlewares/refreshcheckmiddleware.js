import jwt from "jsonwebtoken"
function refreshtokencheckmiddleware(req,res,next) {
     console.log("===== REFRESH CHECK =====");
    console.log("Cookies:", req.cookies);
    console.log("Headers Cookie:", req.headers.cookie);
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