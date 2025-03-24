const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose = require("mongoose");
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabaseUrl = "https://ohoyulauwjfysjmhqxot.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ob3l1bGF1d2pmeXNqbWhxeG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTgwNDIsImV4cCI6MjA1ODM5NDA0Mn0.vRg2eB5PwHlwNR-imKn7urcEtP8A7hFNqIrzziC7jLQ";
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Upload Profile Photo
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Store in memory for processing

router.post('/upload-photo', upload.single("file"), async (req, res) => {
    try {
        const { userId } = req.body; // Extract userId correctly
        const file = req.file; // File comes from `multer`

        if (!file || !userId) {
            return res.status(400).json({ error: "File and userId are required." });
        }

        const fileName = `${userId}_${Date.now()}_${file.originalname}`;

        const { data, error } = await supabase.storage
            .from('images')
            .upload(`${fileName}`, file.buffer, { cacheControl: '3600', upsert: true });

        if (error) return res.status(500).json({ error: error.message });

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(`${fileName}`);

        await supabase.from('users').update({ photoURL: publicUrl }).eq('id', userId);
        
        const payload = {
          photo: publicUrl
        };
  
        console.log(payload);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            payload,
            { new: true }
        );
  
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: 'Photo uploaded successfully!', photoURL: publicUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
