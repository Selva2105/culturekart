const mongoose = require('mongoose');

// Define the schema for revoked tokens
const revokedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800, // Set the expiration time for each document (in seconds)
  },
});

// Create the RevokedToken model
const RevokedToken = mongoose.model('RevokedToken', revokedTokenSchema);

module.exports = RevokedToken;
