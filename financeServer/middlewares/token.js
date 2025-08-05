const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) {
        return res.status(401).json("Authorization Failed! Token not provided");
    }

    const token = tokenHeader.split(" ")[1];

    try {
        const jwtResponse = jwt.verify(token, "superkey123");
        req.payload = jwtResponse._id;
        next();
    } catch (err) {
        res.status(401).json("Authorization Failed! Please login");
    }
};

module.exports = { jwtMiddleware };