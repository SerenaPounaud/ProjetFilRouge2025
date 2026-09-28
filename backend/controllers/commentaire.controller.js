import Commentaire from "../models/commentaire.model.js";

export const createCommentaire = async (req, res, next) => {
    try {
        const commentaire = new Commentaire({
            contenu: req.body.contenu,
            note: req.body.note,
            user: req.userId,
            recipe: req.params.id
        });
        await commentaire.save();
        res.json({message: "Commentaire ajouté", commentaire});
    } catch (error) {
        next(error);
    }
};

export const getCommentaireById = async (req, res, next) => {
    try {
        const commentaire = await Commentaire.findById(req.params.id);
        if (!commentaire){
            return res.status(404).json({message: "Commentaire introuvable"})
        }
        res.json(commentaire); //récupére le commentaire
        
    } catch (error) {
        next(error);
    }
};

export const deleteCommentaireById = async (req, res, next) => {
    try {
        const commentaire = await Commentaire.findById(req.params.id);
        if (!commentaire){
            return res.status(404).json({message: "Commentaire introuvable"})
        }
        if (commentaire.user.toString() !== String(req.userId)) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        await commentaire.deleteOne();
        res.json({message: "Commentaire supprimé"});
        
    } catch (error) {
        next(error);
    }
};

export const updateCommentaire = async (req, res, next) => {
    try {
        const commentaire = await Commentaire.findById(req.params.id);

        if (!commentaire) {
            return res.status(404).json({ message: "Commentaire introuvable" });
        }
        if (commentaire.user.toString() !== String(req.userId)) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        Object.assign(commentaire, req.body);
        await commentaire.save();
        res.json({message: "Commentaire modifié", commentaire});

    } catch (error) {
        next(error);
    }
};
