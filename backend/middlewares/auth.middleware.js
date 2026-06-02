import jwt from "jsonwebtoken"; //permet de générer un token lors d'une connexion

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; //récupère le token
    
    if(!authHeader) return res.status(403).json({message: "Token requis"});

    const token = authHeader.split(" ")[1]; //retourne uniquement le token (Bearer "Token", après l'espace)

    try { //vérifie la validité du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //récupère la clé pour la sécurité
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({message: "Token invalide"})
    }
};