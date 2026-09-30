import express from "express";
import { validateCommentaire } from "../middlewares/commentaire.validation.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { sanitizeBody } from "../middlewares/sanitizeBody.middleware.js";
import { createCommentaire, deleteCommentaireById, updateCommentaire, getCommentairesByRecipe } from "../controllers/commentaire.controller.js";

const router = express.Router();

router.post("/:recipeId/commentaires", verifyToken, sanitizeBody(["contenu", "note"]), validateCommentaire, createCommentaire);
router.delete("/:id",verifyToken, deleteCommentaireById);
router.get("/recipe/:recipeId", getCommentairesByRecipe);
router.put("/:id", verifyToken, sanitizeBody(["contenu", "note"]), validateCommentaire, updateCommentaire);

export default router;