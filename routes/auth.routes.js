const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Login Handle
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    // Check user existence & active status
    if (!user || !user.isActive) {
      return res.send('Invalid credentials....');
    }

    // Plain password check (NO bcrypt)
    if (user.password !== password) {
      return res.send('Invalid credentials...');
    }

    // Save user in session
    req.session.user = user;

    // Role based redirect
    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/user/dashboard');
    }

  } catch (err) {
    console.error(err);
    res.send('Server error');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;