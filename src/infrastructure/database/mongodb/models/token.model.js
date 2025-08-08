const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Establishes a reference to the User model
    },
    token: {
        type: String,
        required: true,
        index: true, // Adds an index for faster lookups by token
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // This tells Mongoose to automatically delete the document after a specified time.
        // This value should match your REFRESH_TOKEN_EXPIRATION environment variable (e.g., '7d').
        expires: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    },
});

const TokenModel = mongoose.model('Token', tokenSchema);

module.exports = TokenModel;