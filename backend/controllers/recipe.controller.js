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
            tags: req.body.tags,
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
        const limit = parseInt(req.query?.limit) || 16;
        const skip = (page - 1) * limit; //calcul le nombre de document à ignorer pour la pagination
        const categorie = req.query?.categorie;
        const nbPersonnes = req.query?.nbPersonnes;
        const dateTri = req.query?.dateTri;
        const filter = {};

        if (categorie) {
            filter.categorie = categorie;        
        }
        if (nbPersonnes === 'plus5') {
            filter.nbPersonnes = { $gt: 5 }; //filtre les recettes avec plus de 5 personnes
        } else if (nbPersonnes) {
            const nombre = Number(nbPersonnes);
            if ([1, 2, 3, 4].includes(nombre)) {
                filter.nbPersonnes = nombre; //filtre les recettes avec le nombre de personnes spécifié
            }
        }
        let sort = {};
        if (dateTri === 'recent') {
            sort = {createdAt: -1}; 
        } else if (dateTri === 'ancien') {
            sort = {createdAt: 1};
        }

        //remplace l'ID stocké dans userID par les informations complètes de l'utilisateur correspondant
        const recipes = await Recipe.find(filter).populate("user", "lastname firstname").sort(sort).skip(skip).limit(limit); 
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

        recipe.nomRecette = req.body.nomRecette;
        recipe.img = req.body.img;
        recipe.temps = req.body.temps;
        recipe.nbPersonnes = req.body.nbPersonnes;
        recipe.ingredients = req.body.ingredients;
        recipe.instructions = req.body.instructions;
        recipe.motsCles = req.body.motsCles;
        recipe.categorie = req.body.categorie;
        recipe.tags = req.body.tags;
        
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