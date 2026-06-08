import express from "express";
import { addRecipe, deleteRecipeById, getAllRecipes, getMyRecipes, getRecipeById, updateRecipe } from "../controllers/recipe.controller.js";
import { validateRecipe } from "../middlewares/recipe.validation.js";
import { transformRecipe } from "../middlewares/transform.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, transformRecipe, validateRecipe, addRecipe);
router.get("/", getAllRecipes);
router.get("/my", verifyToken, getMyRecipes);
router.get("/:id", getRecipeById);
router.delete("/:id",verifyToken, deleteRecipeById);
router.put("/:id",verifyToken, updateRecipe);

export default router;