import Recipe from "../models/recipe.model.js";

//Ajoute une recette
export const addRecipe = async (req, res, next) => {
    try {
        const recipe = new Recipe({
            nomRecette: req.body.nomRecette,
            img: req.body.img,
            temps: req.body.temps,
            nbPersonnes: req.body.nbPersonnes,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            motsCles: req.body.motsCles,

            //id user connecté
            userID: req.userId 
        });
        await recipe.save(); //sauvegarde dans la db

        res.json({message: "Recette ajouté", recipe});
        
    } catch (error) {
        next(error);
    }
};

//Voir toutes les recettes
export const getAllRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes); //envoi la liste
        
    } catch (error) {
        next(error);
    }
};

//Récupére un produit
export const getRecipeById = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe){
            return res.json({message: "Recette introuvable"})
        }
        res.json(recipe); //récupére la recette
        
    } catch (error) {
        next(error);
    }
};

//Supprime une recette
export const deleteRecipeById = async (req, res, next) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe){
            return res.json({message: "Recette introuvable"})
        }
        res.json({message: "Recette supprimée"});
        
    } catch (error) {
        next(error);
    }
};

//Modifier une recette
export const updateRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true}); //retourne la recette à jour
        if (!recipe){
            return res.json({message: "Recette introuvable"})
        }
        res.json({message: "Recette modifiée", recipe}); //retourne la recette
        
    } catch (error) {
        next(error);
    }
};