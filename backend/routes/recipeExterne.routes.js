import express from 'express';
import { importMeals } from '../controllers/recipeExterne.controller.js';

const router = express.Router();

router.get('/import-themealdb', importMeals);

export default router;