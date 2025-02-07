const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");
const secretkey = process.env.SECRET_KEY;
const uploadImage = require("../config/upload.js");

const registerUser = async (req, res) => {
  const { name, email, username, password } = req.body;

  // Check if email already exists
  const existingUser = await UserModel.findOne({ email: email });
  if (existingUser) {
    return res
      .status(400)
      .json({ status: "failed", message: "User already exists" });
  }

  const existingUsername = await UserModel.findOne({ username: username });

  if (existingUsername) {
    return res
      .status(400)
      .json({ status: "failed", message: "Username already exists" });
  }

  const image_url = await uploadImage(req.file.path);

  bcrypt.genSalt(10, (_err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) throw err;
      const user = new UserModel({
        image: image_url,
        name,
        email,
        username,
        password: hash,
      });

      try {
        await user.save();
        let token = jwt.sign({ email: email, userID: user._id }, secretkey);
        
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject._id;
        userObject.id = user._id;
        res.json({
          status: "success",
          message: "Login successful",
          token: token,
          user: userObject,
        });

      } catch (err) {
        res.status(400).json({ status: "failed", message: err.message });
      }
    });
  });
};

const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  // Check if email or username exists
  const user = await UserModel.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    return res
      .status(400)
      .json({ status: "failed", message: "User does not exist" });
  }

  // Check if password is correct
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) throw err;
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid credentials" });
    }

    let token = jwt.sign({ email: user.email, userID: user._id }, secretkey);

        const userObject = user.toObject();
        delete userObject.password;
        delete userObject._id;
        userObject.id = user._id;
        res.json({
          status: "success",
          message: "Login successful",
          token: token,
          user: userObject,
        });
  });
};

module.exports = {
  registerUser,
  loginUser,
};
