import Joi from "joi"; //permet la validation pour être accepter dans la db

export const validateContact = (req, res, next) => {
    const Schema = Joi.object({
        lastname : Joi.string().max(50).pattern(/^[a-zA-ZÀ-ÿ\s-]+$/).required().messages({
            "string.base" : "Le nom doit être une chaîne de caractères",
            "string.empty" : "Le nom est obligatoire",
            "string.max" : "Maximum 50 caractères",
            "string.pattern.base": "Le nom contient des caractères invalides",
            "any.required" : "Le nom est obligatoire"
        }),
        firstname: Joi.string().max(50).pattern(/^[a-zA-ZÀ-ÿ\s-]+$/).required().messages({
            "string.base" : "Le prénom doit être une chaîne de caractères",
            "string.empty" : "Le prénom est obligatoire",
            "string.max" : "Maximum 50 caractères",
            "string.pattern.base": "Le prénom contient des caractères invalides",
            "any.required" : "Le prénom est obligatoire"
        }),
        email: Joi.string().max(150).email({tlds: {allow: true}}).required().messages({
            "string.base": "L'email doit être une chaîne de caractères",
            "string.email": "Email invalide",
            "string.empty": "L'email est obligatoire",
            "string.max": "Maximum 150 caractères",
            "any.required": "L'email est obligatoire"
        }),
        message: Joi.string().max(1000).pattern(/^[\p{L}\p{N}\s.,!?'"’()\-:;@€%&/]+$/u).required().messages({ //autorise lettres, chiffres, accents, espaces et ponctuation
            "string.base" : "Le message doit être une chaîne de caractères",
            "string.empty" : "Le message est obligatoire",
            "string.max" : "Maximum 1000 caractères",
            "any.required" : "Le message est obligatoire"
        }),
        rgpd: Joi.boolean().valid(true).required().messages({
            "boolean.base": "Le champ RGPD doit être un booléen",
            "any.only": "Vous devez accepter le traitement des données personnelles",
            "any.required": "Veuillez accepter le traitement des données personnelles"
        }),
    });

    // vérifie si le body respecte le schema + montre toutes les erreurs
    const {error} = Schema.validate(req.body, {abortEarly: false, allowUnknown: false}); //n'autorise pasles champs supplémentaires dans le body

    if (error) {
        return res.status(400).json({ //Bad Request, client error
            message: "Erreur de validation",
            errors: error.details.map((err => err.message)) //parcourt + créer un tab puis retourne le message
        });
    }
    next();
};