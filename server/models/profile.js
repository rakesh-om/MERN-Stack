const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  title: String,
  email: String,
  phone: String,
  location: String,
  linkedin: String,
  github: String,
  website: String,
  bio: String,
  skills: {
    languages: [String],
    frameworks: [String],
    databases: [String],
    shopify: [String],
    tools: [String],
  },
  experience: [
    {
      company: String,
      position: String,
      duration: String,
      description: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      year: String,
    },
  ],
  projects: [
    {
      name: String,
      description: String,
      url: String,
    },
  ],
  certifications: [
    {
      name: String,
      issuer: String,
      year: String,
    },
  ],
  languages: [String],
  interests: [String],
  extra: {
    availability: String,
    relocation: String,
    strengths: [String],
  },
});

module.exports = mongoose.model('Profile', profileSchema);
