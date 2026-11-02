export const errorHandler = (err, req, res, next) => {
    console.error(err);

    //vérifie si l'erreur provient de Joi ou d'une autre bibliothèque qui utilise ce nom
    if (err.isJoi || err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Erreur de validation",
            errors: err.details?.map(e => e.message) //extrait le message de chaque erreur
        });
    }

    const statusCode = err.statusCode || 500; 

    res.status(statusCode).json({
        success: false,
        message: err.message || "Erreur serveur",
    });
};