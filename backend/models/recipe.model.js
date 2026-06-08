import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    nomRecette: String,
    img: String,
    temps: String,
    nbPersonnes: Number,
    ingredients: [String],
    instructions: String,
    motsCles: [String],
    source: {
        type: String,
        enum: ["local", "themealdb"], //valeurs autorisées
        default: "local"
    },
    sourceId: {
        type: String,
        default: null,
        index: true, //accélère les recherches
        unique: true, //empêche les doublons
        sparse: true //ignore les null pour l'unicité
    },
    dateAjout: {
        type: Date,
        default: Date.now
    },
    //référence avec user
    user: {
        type: mongoose.Schema.Types.ObjectId, //défini user comme un objectID
        ref: "User" //pointe vers le document user
    }
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;