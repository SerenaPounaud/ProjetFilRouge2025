import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentaireSchema = new Schema(
    {
        contenu: {type: String, required: true, maxlength: 500, trim: true},
        note: {type: Number, required: true, min: 1, max: 5},
        recette: {type: Schema.Types.ObjectId, ref: "Recipe", required: true},
        user: {type: Schema.Types.ObjectId, ref: "User", required: true}
    },
    {
        timestamps: {
            createdAt: "dateAjout",
            updatedAt: "dateModification"
        }
    }
);

const Commentaire = model("Commentaire", commentaireSchema);

export default Commentaire;