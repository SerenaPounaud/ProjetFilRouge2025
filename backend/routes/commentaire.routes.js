import express from "express";
import { validateCommentaire } from "../middlewares/commentaire.validation.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { sanitizeBody } from "../middlewares/sanitizeBody.middleware.js";

const router = express.Router();

router.post("/", verifyToken, sanitizeBody(["contenu", "note"]), validateCommentaire);
router.get("/:id", sanitizeBody(["contenu", "note"]));

export default router;