//configuration express
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { corsOptions } from "./cors/cors.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
//app.use(cors()); //autorise tout (mode dev)
app.use(cors(corsOptions));

app.use(express.json()); //permet de récupèrer les données json

//connexion routes
app.use("/api", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/contacts", contactRoutes);

//récupère tous les messages d'erreurs
app.use(errorHandler);

export default app;