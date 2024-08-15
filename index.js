const express = require('express');
const authRoutes = require('./routes/authRoutes');
const app = express();
require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());
app.use('/api/auth', authRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
