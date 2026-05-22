import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    nomRecette: String,
    img: String,
    heures: Number,
    minutes: Number,
    nbPersonnes: Number,
    ingredients: [String],
    instructions: String,
    motsCles: [String]
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;