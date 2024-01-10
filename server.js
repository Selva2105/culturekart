const express = require("express");
const cors = require("cors");
const CustomError = require("./utils/customError");
const globalErrorHandler = require("./middleware/globalErrorhandler"); const dotenv = require('dotenv');
const path = require('path')
dotenv.config({});
const connectDB = require('./utils/connectDB');

const PORT = process.env.PORT || 3000;
const DBURL = process.env.MONGO_URL

const app = express();

// CORS options
const corsOptions = {
    origin: ["http://localhost:3006", "https://ikart-six.vercel.app"],
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
};


const productRouter = require("./router/router.product");
const authRouter = require("./router/router.user");
const logRouter = require("./router/router.auth");

app.use(express.json());
app.use(cors(corsOptions));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome to the root of the server!');
});

//Routers
app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", authRouter)
app.use("/api/v1/auth", logRouter)

//  404 route
app.all("*", (req, res, next) => {
    const err = new CustomError(
        `Can't find ${req.originalUrl} on the server`,
        404
    );
    next(err);
});

app.use(globalErrorHandler);

// Call the MongoDB connection function
connectDB(DBURL);

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
