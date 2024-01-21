const express = require("express");
const cors = require("cors");
const CustomError = require("./utils/customError");
const globalErrorHandler = require("./middleware/globalErrorhandler");
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./utils/connectDB');

dotenv.config({});

// Define server port and MongoDB connection URL
const PORT = process.env.PORT || 3000;
const DBURL = process.env.MONGO_URL;

const app = express();

// CORS configuration for allowing cross-origin requests
const corsOptions = {
    origin: ["http://localhost:3006", "https://ikart-six.vercel.app"],
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
};

// Import routers for different API endpoints
const productRouter = require("./router/router.product");
const authRouter = require("./router/router.user");
const logRouter = require("./router/router.auth");

// Use JSON parsing middleware
app.use(express.json());

// Enable CORS with specified options
app.use(cors(corsOptions));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route to display a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the root of the server!');
});

// Route handling for products API
app.use("/api/v1/product", productRouter);

// Route handling for user authentication API
app.use("/api/v1/user", authRouter);

// Route handling for authentication API
app.use("/api/v1/auth", logRouter);

// 404 route - Handles requests to undefined routes
app.all("*", (req, res, next) => {
    const err = new CustomError(
        `Can't find ${req.originalUrl} on the server`,
        404
    );
    next(err);
});

// Global error handler middleware - Handles errors throughout the application
app.use(globalErrorHandler);

// Call the MongoDB connection function with the provided URL
connectDB(DBURL);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
