import express from "express";
import { addRecipe, deleteRecipeById, getAllRecipes, getRecipeById, updateRecipe } from "../controllers/recipe.controller.js";

const router = express.Router();

router.post("/", addRecipe);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.delete("/:id", deleteRecipeById);
router.put("/:id", updateRecipe);

export default router;