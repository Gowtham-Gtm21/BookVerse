const jwt = require("jsonwebtoken");
const User = require("../models/Users");

exports.protect = async (req, res, next) => {
  try {
    // Get token from header: Authorization: Bearer <token>
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token; // if using cookies
    }

    if (!token) return res.status(401).json({ msg: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user to request (without password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User no longer exists" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token invalid or expired" });
  }
};
