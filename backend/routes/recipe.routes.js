import express from "express";
import { addRecipe, deleteRecipeById, getAllRecipes, getRecipeById, updateRecipe } from "../controllers/recipe.controller.js";
import { validateRecipe } from "../middlewares/recipe.validation.js";
import { transformRecipe } from "../middlewares/transform.middleware.js";

const router = express.Router();

router.post("/", transformRecipe, validateRecipe, addRecipe);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.delete("/:id", deleteRecipeById);
router.put("/:id", updateRecipe);

export default router;