const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;  // Updated default port

// Import routes
const lettersRouter = require('./routes/letters');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Add explicit CORS origin
    credentials: true
}));
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'Dear Santa API is running!' });
});

// Use routes
app.use('/letters', lettersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        details: err.message
    });
});

app.listen(port, '0.0.0.0', () => {  // Listen on all network interfaces
    console.log(`Server running on http://localhost:${port}`);
}); 