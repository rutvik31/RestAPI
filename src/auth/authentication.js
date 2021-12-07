require('dotenv').config()
const jwt = require('jsonwebtoken');


//Auth middleware
exports.auth = function (req, res, next) {
    const authHeader = req.headers.authorization
    try {
        if (!authHeader) {
            res.status(401).send({ message: "Forbbiden" })
        }
        jwt.verify(authHeader, process.env.TOKEN_SECERT)
        next()
    } catch (err) {
        res.status(401).send({ status: "error", message: err.message })
    }
}
