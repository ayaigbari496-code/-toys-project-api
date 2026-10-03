const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.header("x-api-key");
  
  if (!token) {
    return res.status(401).json({ msg: "Access denied. Please provide an x-api-key token in the headers." });
  }

  try {
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    req.tokenData = decode;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
};

module.exports = { auth };
