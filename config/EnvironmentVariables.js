require('dotenv').config();

exports.EnviromentVariables = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    EXPIRED_DATE: process.env.EXPIRED_DATE,
    SALTED: process.env.SALTED,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};