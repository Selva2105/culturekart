const jwt = require('jsonwebtoken');

/**
 * Signs a JWT token with the provided user ID.
 *
 * @param {string} id - User ID to be included in the token payload.
 * @returns {string} - Generated JWT token.
 */
const SignToken = (id) => {

    // Sign the token with the provided user ID, using the secret key and setting expiration time
    const token = jwt.sign(
        { id },
        process.env.SECRET_STR,
        {
            expiresIn: process.env.LOGIN_EXPIRES
        }
    );

    return token; // Return the generated token
}

module.exports = SignToken;
