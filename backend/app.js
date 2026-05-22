//configuration express
import express from "express";
import userRoutes from "./routes/user.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";

const app = express();

app.use(express.json()); //permet de récupèrer les données json
//connexion routes
app.use("/api", userRoutes);
app.use("/api", recipeRoutes);

export default app;