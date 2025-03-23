const path = require("path");
const jwt = require('jsonwebtoken')
const getImageFileName = (name) => {
  return `IMG-${Date.now()}${path.extname(name)}`;
};

const generateToken = (user_id)=>{
  return jwt.sign({user_id}, process.env.JWT_TOKEN_KEY, { expiresIn: "24h" })
}

const verifyToken = (token)=>{
  return jwt.verify(token,process.env.JWT_TOKEN_KEY)
}

module.exports = { getImageFileName , generateToken, verifyToken};
