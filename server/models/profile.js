const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const experienceSchema = new Schema({
  company: String,
  position: String,
  duration: String,
  description: String
}, { _id: false });

const educationSchema = new Schema({
  institution: String,
  degree: String,
  year: String
}, { _id: false });

const certificationSchema = new Schema({
  name: String,
  issuer: String,
  year: String
}, { _id: false });

const portfolioSchema = new Schema({
  name: String,
  category: String
}, { _id: false });

const contactSchema = new Schema({
  email: String,
  phone: String,
  social: {
    github: String,
    linkedin: String
  }
}, { _id: false });

const ctaSchema = new Schema({
  hire_me: Boolean,
  download_cv: Boolean
}, { _id: false });

const extraSchema = new Schema({
  availability: String,
  relocation: String,
  strengths: [String]
}, { _id: false });

const profileSchema = new Schema({
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
  summary: String,

  experience: [experienceSchema],
  experienceSummary: String,
  projectSummary: String,
  clients: String,
  services: [String],

  skills: Schema.Types.Mixed, // use this if structure varies or is deeply nested

  portfolio: [portfolioSchema],
  education: [educationSchema],
  certifications: [certificationSchema],

  languages: [String],
  interests: [String],

  contact: contactSchema,
  cv_link: String,
  avatar: String,
  cta: ctaSchema,
  extra: extraSchema
});

module.exports = mongoose.model('Profile', profileSchema);
