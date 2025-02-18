const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update User
router.put("/users/:id", async (req, res) => {
  try {
      const { name, email } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
  } catch (err) {
      res.status(500).json({ message: "Server error" });
  }
});

// Delete User
router.delete("/users/:id", async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
  } catch (err) {
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
