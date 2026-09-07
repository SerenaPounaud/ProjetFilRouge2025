import mongoose from "mongoose";

const { Schema, model } = mongoose;

const recipeSchema = new Schema(
    {
        nomRecette: {
            type: String,
            required: true,
        },
        img: {
            type: String,
            default: null
        },
        temps: {
            type: String,
            default: null
        },
        nbPersonnes: {
            type: Number,
            default: null,
            min: 1
        },
        ingredients: {
            type: [String],
            default: []
        },
        instructions: {
            type: String,
            default: null
        },
        motsCles: {
            type: [String],
            default: []
        },
        categorie: {
            type: String,
            default: null
        },
        source: {
            type: String,
            enum: ["local", "themealdb"],
            default: "local"
        },
        sourceId: {
            type: String,
            default: null,
            unique: true,
            sparse: true //ignore les valeurs nulles pour l'unicité
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: {
            createdAt: "dateAjout",
            updatedAt: "dateModification"
        }
    }
);

const Recipe = model("Recipe", recipeSchema);

export default Recipe;