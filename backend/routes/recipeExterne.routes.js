import express from 'express';
import { importMeals, getCategories } from '../controllers/recipeExterne.controller.js';

const router = express.Router();

router.post('/import-themealdb', importMeals);
router.get('/categories', getCategories);

export default router;