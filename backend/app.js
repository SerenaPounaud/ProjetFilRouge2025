//configuration express
const express = require('express');
const userRoutes = require("./routes/user.routes");

const app = express();

//connexion routes
app.use("/api", userRoutes);

module.exports = app;