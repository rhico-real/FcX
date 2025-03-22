const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose = require("mongoose");

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

// Get User by ID
router.get("/users/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});

// Update User
// router.put("/users/:id", async (req, res) => {
//   try {
//       const { name, email } = req.body;
//       const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
//       if (!user) return res.status(404).json({ message: "User not found" });
//       res.json(user);
//   } catch (err) {
//       res.status(500).json({ message: "Server error" });
//   }
// });

//update user textfields
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
      const payload = {
        name: req.body.name,
        accountNumber: req.body.accountNumber,
        contact: req.body.contact,
        billingAddress: req.body.billingAddress,
        plan: req.body.plan,
        status: req.body.status,
      };

      console.log(payload);
      const updatedUser = await User.findByIdAndUpdate(
          id,
          payload,
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
  } catch (err) {
      console.error(err);
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
