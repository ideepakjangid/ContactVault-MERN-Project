const { verifyToken } = require("../lib/helper");

const adminAuth = (req, res, next) => {

    // Extract token from headers
    const token = req.headers.authorization; // Expecting raw token, not "Bearer token"

    if (!token) {
        return res.status(200).json({ flag: 0, message: "Access token is required!" });
    }

    try {
        const decodedUser = verifyToken(token); // Verify the raw token
        if (!decodedUser) {
            return res.status(200).json({ flag: 0, message: "Invalid access token!" });
        }
        next();
    } catch (error) {
        return res.status(200).json({ flag: 0, message: "Unauthorized: Invalid token", error: error.message });
    }
};

module.exports = adminAuth;
