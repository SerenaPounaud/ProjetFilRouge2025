import express from "express"; //permet d'utiliser router
import {getHello} from "../controllers/user.controller.js";

const router = express.Router(); //envoie vers le bon controllers

router.get("/hello", getHello);

export default router;