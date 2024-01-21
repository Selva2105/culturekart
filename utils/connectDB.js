const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database.
 * @param {string} dbURL - The URL of the MongoDB database.
 * @returns {Promise<void>} - A promise that resolves when the connection is successful.
 */
const connectDB = async (dbURL) => {
    try {
        // Attempt to connect to the MongoDB database
        await mongoose.connect(dbURL);

        // Log a success message if the connection is established
        console.log('MongoDB connected successfully');
    } catch (error) {
        // Log an error message if there is an issue connecting to the database
        console.error('Error connecting to MongoDB:', error.message);

        // Terminate the application process in case of a connection error
        process.exit(1);
    }
};

module.exports = connectDB;
