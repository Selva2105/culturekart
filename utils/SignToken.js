const jwt = require('jsonwebtoken');

const SignToken = id => {

    // 1. Sign the token means token will be generated and it will be returned
    return token = jwt.sign(
        { id },
        process.env.SECRET_STR,
        {
            expiresIn: process.env.LOGIN_EXPIRES
        }
    );
}

module.exports = SignToken;