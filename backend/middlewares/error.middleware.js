export const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500; //erreur serveur
    res.status(statusCode).json({
        success: false, 
        message: err.message || "Erreur serveur"
    });
};