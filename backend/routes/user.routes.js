import express from "express"; //permet d'utiliser router
import { signin, signup, me, logout, updateProfil} from "../controllers/user.controller.js";
import { sanitizeBody } from "../middlewares/sanitizeBody.middleware.js";
import { validateUser } from "../middlewares/user.validation.js";
import { transformUser } from "../middlewares/transformUser.middleware.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateUpdateUser } from "../middlewares/updateUser.validation.js";

const router = express.Router(); //envoie vers le bon controllers

router.post("/signup", sanitizeBody(["lastname", "firstname", "email", "password", "cgu"]),transformUser, validateUser, signup);
router.post("/signin", sanitizeBody(["email", "password"]), loginLimiter, signin);
router.get("/me", verifyToken, me);
router.post("/logout", logout);
router.put("/me", verifyToken, sanitizeBody(["lastname", "firstname", "email", "currentPassword", "newPassword"]), transformUser, validateUpdateUser, updateProfil);

export default router;