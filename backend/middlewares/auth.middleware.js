import jwt from "jsonwebtoken"; //permet de créer et vérifier un token lors d'une connexion

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; //récupère l'en-tête http
    
    if(!authHeader) return res.status(403).json({message: "Token requis"});

    const token = authHeader.split(" ")[1]; //retourne uniquement le token (Bearer "Token")

    try { //vérifie la validité du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //vérifie qu'il est valide
        req.userId = decoded.userId; //ajoute l'id de l'user à la requête
        next();
    } catch (error) {
        return res.status(401).json({message: "Token invalide"})
    }
};