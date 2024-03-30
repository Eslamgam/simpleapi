const appError = require("../utils/appError")
const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText')


const verfiyToken = (req, res, next)=>{
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader){
        const error = appError.create('token is required', 401, httpStatusText.ERROR)
        return next(error)
    }

    const token = authHeader.split(' ')[1]
    try{

        const currentUser = jwt.verify(token, process.env.SECRET_KEY_TOKEN)
        req.currentUser = currentUser
        next()

    }catch(err){
        const error = appError.create('invalid token', 401, httpStatusText.ERROR)
        return next(error);
    }

}


module.exports = verfiyToken;