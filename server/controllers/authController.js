const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usermodel=require("../models/Users");


// helper to sign JWT
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    // check existing user
    const existing = await usermodel.findOne({ email });
    if (existing) return res.status(409).json({ msg: "Email already registered" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await usermodel.create({ name, email, password: hashed, role });
    // console.log(user)
    // optionally don't return password
    const token = signToken(user);

    return res.status(201).json({ msg: "User registered", user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Missing credentials" });

    const user = await usermodel.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ msg: "Invalid email or password" });

    const token = signToken(user);
    // console.log(token)
   return  res.json({ msg: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};
