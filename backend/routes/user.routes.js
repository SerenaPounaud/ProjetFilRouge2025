import express from "express"; //permet d'utiliser router
import { signin, signup, me, logout } from "../controllers/user.controller.js";
import { sanitizeBody } from "../middlewares/sanitizeBody.middleware.js";
import { validateUser } from "../middlewares/user.validation.js";
import { transformUser } from "../middlewares/transformUser.middleware.js";
import { LoginLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router(); //envoie vers le bon controllers

router.post("/signup", sanitizeBody(["lastname", "firstname", "email", "password", "cgu"]), validateUser, transformUser, signup);
router.post("/signin", sanitizeBody(["email", "password"]), LoginLimiter, signin);
router.get("/me", me);
router.post("/logout", logout);

export default router;