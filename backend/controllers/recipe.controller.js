import Recipe from "../models/recipe.model.js";

//Ajoute une recette
export const addRecipe = async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save(); //sauvegarde dans la db

        res.json({message: "Recette ajouté", recipe});
        
    } catch (error) {
        res.json({message: "Erreur lors de l'ajout de la recette"})
    }
}