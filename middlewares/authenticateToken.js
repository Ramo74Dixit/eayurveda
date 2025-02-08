// middlewares/authenticateToken.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN_HERE"

    if (token == null) {
        return res.status(401).send({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Token is invalid or expired" });
        }

        req.user = { id: decoded.id }; // Ensure this matches how you decode the JWT
        console.log("User ID:", req.user.id); // Now logging the correct field
        next();
    });
};



module.exports = authenticateToken;
