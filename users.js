const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel, validateUser, validateLogin } = require("../models/userModel");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  return res.json({ status: "success", msg: "Users Auth Server is running smoothly!" });
});

router.get("/userInfo", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.tokenData._id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error, please try again" });
  }
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ msg: error.details.message });

  try {
    const userExist = await UserModel.findOne({ email: req.body.email });
    if (userExist) return res.status(400).json({ msg: "Email already exists in the system" });

    const newUser = new UserModel(req.body);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();
    newUser.password = "******";
    return res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error, please try again" });
  }
});

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ msg: error.details.message });

  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ msg: "Invalid email or password" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "60mins" }
    );
    return res.json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error, please try again" });
  }
});

module.exports = router;
