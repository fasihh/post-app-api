const jwt = require('jsonwebtoken');
const authFailed = require('../utils/auth-failed');

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], `${process.env.JWT_KEY}`);
        req.userData = decoded
        next();
    } catch(err) {
        return authFailed(res);
    }
}