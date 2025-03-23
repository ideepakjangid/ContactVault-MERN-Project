const { generateToken } = require("../lib/helper.js");
const UserModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");

const UserController = {
  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ flag: 0, message: "All fields are required!" });
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ flag: 0, message: "Email already in use!" });
      }

      const hash = await bcrypt.hash(password, 13);
      const user = new UserModel({ name, email, password: hash });
      await user.save();

      res.status(201).json({
        flag: 1,
        message: "User created successfully!",
        token:generateToken(user._id),
        user: { ...user.toJSON(), password: "" }, // Hide password
      });
    } catch (error) {
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ flag: 0, message: "All fields are required!" });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ flag: 0, message: "User does not exist!" });
      }

      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) {
        return res.status(401).json({ flag: 0, message: "Invalid password!" });
      }

      res.status(200).json({
        flag: 1,
        message: "User logged in successfully!",
        token:generateToken(user._id),
        user: { ...user.toJSON(), password: "" }, // Hide password
      });
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  },
};

module.exports = UserController;
