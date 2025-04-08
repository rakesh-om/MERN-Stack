const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// POST: Add profile
router.post('/', async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: All profiles
router.get('/', async (req, res) => {
  console.log('GET /api/profiles route hit ✅'); // Optional for debugging
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
