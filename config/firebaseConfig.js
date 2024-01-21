const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    firebaseConfig: {
        apiKey: process.env.FB_APIKEY,
        authDomain: process.env.FB_AUTHDOMAIN,
        projectId: process.env.FB_PROJECTID,
        databaseURL:process.env.FB_DBURL,
        storageBucket: process.env.FB_STORAGEBUCKET,
        messagingSenderId: process.env.FB_MESSAGINGSENDERID,
        appId: process.env.FB_APPID,
        measurementId: process.env.FB_MEASUREMENTID,
    }
}