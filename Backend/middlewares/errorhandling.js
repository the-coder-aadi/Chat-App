function errorhandle(error, req, res, next) {
     console.log(error.stack);
    res.status(500).json({
        success:false,
        msg:error.message
    })
}
export default errorhandle