import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    nomRecette: String,
    img: String,
    temps: String,
    nbPersonnes: Number,
    ingredients: [String],
    instructions: String,
    motsCles: [String],
    dateAjout: {
        type: Date,
        default: Date.now
    },
    //référence avec user
    userID: {
        type: mongoose.Schema.Types.ObjectId, //défini user comme un objectID
        ref: "User" //pointe vers le document user
    }
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;