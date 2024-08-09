const express = require('express');
const app = express();
require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Welcome to the Event Management Platform!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
