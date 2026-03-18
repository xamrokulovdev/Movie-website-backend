const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDb = require("./config/mongoose");
const errorHandler = require("./middlewares/error");
require("dotenv").config();

// MongoDb connect 
connectDb();

// Middlewares 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const optionsCors = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(optionsCors));

// movies routes
app.use("/api/v1/movie", require("./routes/movie.route"));

// users routes
app.use("/api/v1/user", require("./routes/user.route"));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT;

const start = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Error in starting server", error.message);
    }
}

start();