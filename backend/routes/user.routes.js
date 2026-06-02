import express from "express"; //permet d'utiliser router
import { signin, signup } from "../controllers/user.controller.js";

const router = express.Router(); //envoie vers le bon controllers

router.post("/users/signup", signup);
router.post("/users/signin", signin);

export default router;