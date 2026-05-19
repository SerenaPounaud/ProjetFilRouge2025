const User = require("../models/user.models");

//get test
const getHello = (req, res) => {
    res.json({message: "Hello from Express"})
}

module.exports = {getHello};