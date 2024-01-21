const dotenv = require('dotenv').config();

module.exports = {
    firebaseConfig: {
        apiKey: process.env.APIKEY,
        authDomain: process.env.AUTHDOMAIN,
        projectId: process.env.PROJECTID,
        databaseURL:process.env.FB_DB_URL,
        storageBucket: process.env.STORAGEBUCKET,
        messagingSenderId: process.env.MESSAGINGSENDERID,
        appId: process.env.APPID,
        measurementId: process.env.MEASUREMENTID,
    }
}