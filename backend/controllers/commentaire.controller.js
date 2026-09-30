import Commentaire from "../models/commentaire.model.js";

export const createCommentaire = async (req, res, next) => {
    try {
        const commentaire = new Commentaire({
            contenu: req.body.contenu,
            note: req.body.note,
            user: req.userId,
            recipe: req.params.recipeId
        });
        await commentaire.save();
        res.json({message: "Commentaire ajouté", commentaire});
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

        commentaire.contenu = req.body.contenu;
        commentaire.note = req.body.note;
        await commentaire.save();
        res.json({message: "Commentaire modifié", commentaire});

    } catch (error) {
        next(error);
    }
};

export const getCommentairesByRecipe = async (req, res, next) => {
  try {
    const commentaires = await Commentaire.find({recipe: req.params.recipeId}) //récupère les commentaires d'une recette
    .populate("user", "lastname firstname").sort({ dateAjout: -1 });//trie par date décroissante

    res.json(commentaires);

  } catch (error) {
    next(error);
  }
};