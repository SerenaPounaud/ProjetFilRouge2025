import Joi from 'joi';

export const validateUpdateUser = (req, res, next) => {
    const Schema = Joi.object({ //autorise lettres, accents, espaces et tirets
        lastname: Joi.string().max(50).pattern(/^[a-zA-ZÀ-ÿ\s-]+$/).messages({
                "string.base": "Le nom doit être une chaîne de caractère",
                "string.min": "Minimum 3 caractères",
                "string.max": "Maximum 50 caractères",
                "string.pattern.base": "Le nom contient des caractères non autorisés"
            }),
        firstname: Joi.string().max(50).pattern(/^[a-zA-ZÀ-ÿ\s-]+$/).messages({
                "string.base": "Le prénom doit être une chaîne de caractère",
                "string.max": "Maximum 50 caractères",
                "string.pattern.base": "Le prénom contient des caractères non autorisés"
            }),

        email: Joi.string().max(150).email({tlds: {allow: true}}).messages({ //extension de domaine
                "string.base": "L'email doit être une chaîne de caractère",
                "string.max": "Maximum 150 caractères",
                "string.email": "L'email doit être valide",
            }),
        currentPassword: Joi.string().min(8).max(20).messages({
                "string.min": "Minimum 8 caractères",
                "string.max": "Maximum 20 caractères"
            }),
        newPassword: Joi.string().min(8).max(20).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).messages({
                "string.base": "Le mot de passe doit être une chaîne de caractère",
                "string.min": "Minimum 8 caractères",
                "string.max": "Maximum 20 caractères",
                "string.pattern.base": "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre"
            }),

    }).min(1).unknown(false).messages({"object.min": "Vous devez renseigner au moins un champ à modifier"}).custom((value, helpers) => {
        if (value.currentPassword && !value.newPassword) {
            return helpers.error("any.custom", {
                message: "Le nouveau mot de passe est obligatoire"
            });
        }
        if (value.newPassword && !value.currentPassword) {
            return helpers.error("any.custom", {
                message: "Le mot de passe actuel est obligatoire"
            });
        }
        return value;
    }).messages({"any.custom": "{{#message}}"});

    //Vérifie si le body respecte le schema + montre toutes les erreurs
    const {error} = Schema.validate(req.body, {abortEarly: false, allowUnknown: false});

    if (error){
        return res.status(400).json({
            message: "Erreur de validation",
            errors: error.details.map(err => err.message)
        });
    }
    next();
};