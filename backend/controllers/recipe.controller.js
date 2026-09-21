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
            categorie: req.body.categorie,
            source: "local",
            user: req.userId //id user connecté
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
        const page = parseInt(req.query?.page) || 1; //récupère param page convertit en entier
        const limit = parseInt(req.query?.limit) || 10;
        const skip = (page - 1) * limit; //calcul le nombre de document à ignorer
        const categorie = req.query?.categories;
        const filter = {};

        if (categorie) {
            filter.categorie = categorie;        
        }

        const recipes = await Recipe.find(filter).populate("user", "lastname firstname").skip(skip).limit(limit); //remplace l'ID stocké dans userID par les informations complètes de l'utilisateur correspondant
        const total = await Recipe.countDocuments(filter); //compte le nombre total de documents
        res.json({data: recipes, page, totalPages: Math.ceil(total/limit), totalItems: total});
    } catch (error) {
        next(error);
    }
};

//Récupére un produit
export const getRecipeById = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe){
            return res.status(404).json({message: "Recette introuvable"})
        }
        res.json(recipe); //récupére la recette
        
    } catch (error) {
        next(error);
    }
};

//Supprime une recette
export const deleteRecipeById = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe){
            return res.status(404).json({message: "Recette introuvable"})
        }
        if (recipe.user.toString() !== String(req.userId)) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        await recipe.deleteOne();
        res.json({message: "Recette supprimée"});
        
    } catch (error) {
        next(error);
    }
};

//Modifier une recette
export const updateRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recette introuvable" });
        }
        if (recipe.user.toString() !== String(req.userId)) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        Object.assign(recipe, req.body);
        await recipe.save();
        res.json({message: "Recette modifiée", recipe});

    } catch (error) {
        next(error);
    }
};

// affiche recette user dans profil
export const getMyRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find({user: req.userId}).populate("user", "lastname firstname");
        res.json(recipes);
    } catch (error) {
        next(error);
    }
}