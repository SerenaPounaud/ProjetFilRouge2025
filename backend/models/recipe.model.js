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
    }
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;