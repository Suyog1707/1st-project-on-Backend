const asyncHandler = (requestHandler) => {
    Promise.resolve(requestHandler( res, req, next)).catch((err) => {next(err)})
}

export default asyncHandler;



// const asyncHandler = (requestHandler) => async () => {
//     try {
//        await requestHandler( req, res, next) 
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }