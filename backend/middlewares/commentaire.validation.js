import Joi from "joi"; //permet la validation pour être accepter dans la db

export const validateCommentaire = (req, res, next) => {
    const Schema = Joi.object({
        contenu : Joi.string().max(500).required().messages({
            "string.base" : "Le contenu doit être une chaîne de caractères",
            "string.empty" : "Le contenu est obligatoire",
            "string.max" : "Maximum 500 caractères",
            "any.required" : "Le contenu est obligatoire"
        }),
        note: Joi.number().max(5).min(1).required().messages({
            "number.base" : "La note doit être un nombre",
            "any.required" : "Indiquer la note",
            "number.max" : "Maximum 5 étoiles",
            "number.min" : "Minimum 1 étoile",
        })
    });
    // vérifie si le body respecte le schema + montre toutes les erreurs
    const {error} = Schema.validate(req.body, {abortEarly: false, allowUnknown: false}); 

    if (error) {
        return res.status(400).json({ //Bad Request, client error
            message: "Erreur de validation",
            errors: error.details.map((err => err.message)) //parcourt + créer un tab puis retourne le message
        });
    }
    next();
};