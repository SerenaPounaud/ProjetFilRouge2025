const express = require("express"); //permet d'utiliser router
const router = express.Router(); //envoie vers le bon controllers

const {getHello} = require("../controllers/user.controller");

router.get("/hello", getHello);

module.exports = router;