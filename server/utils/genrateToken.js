const jwt = require('jsonwebtoken');

const generateToken = (res, user, message) => {
    const token = jwt.sign(
        { userId: user.id }, 
        process.env.SCREAT_KEY, // Keeping the env variable name unchanged
        { expiresIn: '1d' }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production", // Secure in production
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return token;
};

module.exports = { generateToken }; 
