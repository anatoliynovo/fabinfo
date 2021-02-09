require('dotenv').config();
require('./config/passport');

// Modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const bodyParser = require('body-parser');

const http = require('http');
const path = require('path');

const server = http.createServer(app);


// statically delivered folder for production app
app.use('/', express.static(path.join(__dirname, '../dist/fabinfo')));


// Environment production variables 
const mongoURL = `mongodb+srv://${process.env.MONGO_HOST}`; // connection string to Cloudhost MongoDB (mongo-express)
const PORT = process.env.PORT; // connection port to run server for mongodb cloud cluster

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(
    cors({
        origin: "http://localhost:4200"
    })
);


// Connect Database via connection string 
// for connection to db on Cloudhost, use: mongoURL
// for connection to db on MongoDB Cloud, use: URI
mongoose.connect(mongoURL, {
    useNewUrlParser: false,
    useFindAndModify: false,
    useUnifiedTopology: true
});
// because of DeprecationWarning
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.error("Connected to database."));


// Routes
app.use('/', require('./routes/user.router'));
app.use('/', require('./routes/station.router'));
app.use('/', require('./routes/material.router'));
app.use('/', require('./routes/safety.router'));
app.use('/', require('./routes/sign.router'));

// Error Handler for validation (for register)
app.use((err, req, res, next) => {
    if (err.name == 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
});

server.listen(PORT, () => console.log("Server has successfully started."));
