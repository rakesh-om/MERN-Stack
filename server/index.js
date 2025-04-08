const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import and use project routes
const projectRoutes = require('./routes/projects');
app.use('/api/projects', projectRoutes);

// ✅ Import and use profile route
const profileRoutes = require('./routes/profile');
app.use('/api/profiles', profileRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
