

const JWT = require('jsonwebtoken')


module.exports = (payload)=>{
    const token = JWT.sign(payload, process.env.SECRET_KEY_TOKEN, {expiresIn: '1m'})
    return token
}


