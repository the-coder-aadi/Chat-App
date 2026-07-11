import {validationResult} from "express-validator"
function validator(req,res,next) {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.json({
            success:false,
            msg:error.array()
        })
    }
    next()
}
export default validator