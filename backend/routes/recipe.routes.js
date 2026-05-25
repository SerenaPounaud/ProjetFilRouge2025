import express from "express";
import { addRecipe, deleteRecipeById, getAllRecipes, getRecipeById, updateRecipe } from "../controllers/recipe.controller.js";

const router = express.Router();

router.post("/recipes", addRecipe);
router.get("/recipes", getAllRecipes);
router.get("/recipes/:id", getRecipeById);
router.delete("/recipes/:id", deleteRecipeById);
router.put("/recipes/:id", updateRecipe);

export default router;