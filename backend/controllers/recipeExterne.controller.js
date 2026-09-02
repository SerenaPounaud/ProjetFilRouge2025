import Recette from '../models/recipe.model.js';
import * as mealsService from '../services/mealsService.js';

// transforme en tableau propre
function extractIngredients(meal) {
    const ingredients = [];

    // boucle pour récupérer
    for (let i = 1; i <= 20; i++) {
        // notation dynamique
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push(`${ingredient} - ${measure}`); //chaîne formatée
        }
    }
    return ingredients;
}

// Import depuis l'api vers Mongodb
export const importMeals = async (req, res, next) => {
    try {
        const meals = await mealsService.getAllMeals(); //va chercher toutes les recettes

        // évite données invalides
        if (!meals || !Array.isArray(meals)) {
            return res.status(404).json({ message: "Aucune recette trouvée" });
        }

        const existing = await Recette.find({}, { sourceId: 1 }).lean(); //récupère sourceId des recettes stockées, transforme les documents Mongoose en objets JavaScript simples
        const existingSet = new Set(existing.map(r => r.sourceId)); //vérifie si une recette existe déjà puis set

        const newMeals = [];

        for (let meal of meals) {
            if (!existingSet.has(meal.idMeal)) { //évite les doublons
                newMeals.push({
                    nomRecette: meal.strMeal,
                    img: meal.strMealThumb,
                    instructions: meal.strInstructions,
                    ingredients: extractIngredients(meal),
                    temps: 0,
                    nbPersonnes: 1,
                    categorie: meal.strCategory || null,
                    motsCles: [],
                    source: "themealdb",
                    sourceId: meal.idMeal,
                    user: null
                });
            }
        }
        await Recette.insertMany(newMeals);
        res.json({ message: "Import terminé" });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Récupère les catégories présentes dans MongoDB
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Recette.distinct("categorie", { //récupère les valeurs dans categorie, sans doublons
            categorie: { $ne: null } //évite les valeurs nulles
        });
        res.json(categories);
    } catch (error) {
        next(error);
    }
};