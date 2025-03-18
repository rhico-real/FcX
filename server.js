require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require('path');
const crypto = require('crypto');
const passport = require('passport');
const session = require('express-session');
const jwt = require("jsonwebtoken");
require('./passport-setup');

const app = express();

app.use(express.static(path.join(__dirname)));

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Set up session
// Generate a random 32-byte string
const secret = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
  res.redirect(`http://localhost:5000/pages/admin_page.html?token=${token}`);
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));