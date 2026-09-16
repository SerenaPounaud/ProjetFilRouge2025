import express from "express";
import { addRecipe, deleteRecipeById, getAllRecipes, getMyRecipes, getRecipeById, updateRecipe } from "../controllers/recipe.controller.js";
import { validateRecipe } from "../middlewares/recipe.validation.js";
import { transformRecipe } from "../middlewares/transform.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { sanitizeBody } from "../middlewares/sanitizeBody.middleware.js";

const router = express.Router();

router.post("/", verifyToken, sanitizeBody(["nomRecette", "img", "temps", "nbPersonnes", "ingredients", "instructions", "motsCles", "categorie"]),transformRecipe, validateRecipe, addRecipe);
router.get("/", getAllRecipes);
router.get("/me", verifyToken, getMyRecipes);
router.get("/:id", getRecipeById);
router.delete("/:id",verifyToken, deleteRecipeById);
router.put("/:id", verifyToken, sanitizeBody(["nomRecette", "img", "temps", "nbPersonnes", "ingredients", "instructions", "motsCles", "categorie"]), transformRecipe, validateRecipe, updateRecipe);

export default router;