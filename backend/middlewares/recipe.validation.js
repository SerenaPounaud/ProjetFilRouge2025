import Joi from "joi"; //permet la validation pour être accepter dans la db

export const validateRecipe = (req, res, next) => {
    const Schema = Joi.object({
        nomRecette : Joi.string().trim().max(30).required().messages({
            "string.base" : "Le nom doit être une chaîne de caractères",
            "string.empty" : "Le nom est obligatoire",
            "string.max" : "Maximum 30 caractères",
            "any.required" : "Le nom est obligatoire"
        }),
        img: Joi.string().pattern(/^data:image\/(png|jpeg|jpg|webp);base64,/).required().messages({
            "string.pattern.base": "L'image doit être une image valide (png, jpeg, jpg, webp en base64)",
            "any.required": "L'image est obligatoire"
        }),
        temps: Joi.string()
        .pattern(/^\d+h\d{1,2}$/)
        .required()
        .messages({
            "string.pattern.base": "Format attendu : 2h30",
            "any.required": "Le temps est obligatoire",
        }),
        nbPersonnes: Joi.number().max(10).min(1).required().messages({
            "number.base" : "Le nombre de personnes doit être un nombre",
            "any.required" : "Indiquer le nombre de personnes",
            "number.max" : "Maximum 10 personnes",
            "number.min" : "Minimum 1 personne",
        }),
        ingredients: Joi.array()
            .items(
                Joi.string().trim().max(20).min(3).messages({
                    "string.base": "Chaque ingrédient doit être une chaîne de caractères",
                    "string.empty": "Ingrédient obligatoire",
                    "string.max": "Un ingrédient ne peut pas dépasser 20 caractères",
                    "string.min": "Un ingrédient doit faire minimum 3 caractères"
                })
            )
            .min(1)
            .required()
            .messages({
                "array.base": "Les ingrédients doivent être un tableau",
                "array.min": "Il faut au moins un ingrédient",
                "any.required": "Les ingrédients sont obligatoires"
            }),
        instructions : Joi.string().trim().max(60000).required().messages({
            "string.empty" : "Instructions obligatoire",
            "string.max" : "Maximum 60 000 caractères",
            "any.required": "Instructions obligatoire"
        }),
        motsCles: Joi.array()
            .items(
                Joi.string().trim().min(3).max(30).messages({
                    "string.base": "Chaque mot-clé doit être une chaîne de caractères",
                    "string.empty": "Mot-clé obligatoire",
                    "string.min": "Un mot-clé doit faire au moins 3 caractères",
                    "string.max": "Un mot-clé ne peut pas dépasser 30 caractères"
                })
            )
            .min(1)
            .required()
            .messages({
                "array.base": "Les mots-clés doivent être un tableau",
                "array.min": "Il faut au moins un mot-clé",
                "any.required": "Les mots-clés sont obligatoires"
            }),
    });
    // vérifie si le body respecte le schema + montre toutes les erreurs
    const {error} = Schema.validate(req.body, {abortEarly: false}); 

    if (error) {
        return res.status(400).json({ //Bad Request
            message: "Erreur de validation",
            errors: error.details.map((err => err.message)) //parcourt les erreurs et récupère le message
        });
    }
    next();
};