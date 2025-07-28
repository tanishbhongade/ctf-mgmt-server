const jwt = require('jsonwebtoken')

const protect = async (req, res, next) => {
    const token = req.cookies?.jwt

    if (!token) {
        return res.status(401).json({
            status: 'failed',
            data: 'No token presented'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body.playerId = decoded.playerId
        next()
    } catch (err) {
        return res.status(401).json({
            status: "failed",
            data: "Token expired, please login again"
        })
    }
}

module.exports = { protect }