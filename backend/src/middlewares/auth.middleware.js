const jwt = require('jsonwebtoken')

async function authUser(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "pls create a account (Unauthorize)"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(decoded.role !== "admin" && decoded.role !== "user"){
            return res.status(403).json({
                message: "you can't access"
            })
        }

        req.user = decoded.id

        next()
    } catch (error) {
        console.error(error);
        res.status(401).json({
            message: "Unauthorize"
        })
    }
}

module.exports = {authUser}