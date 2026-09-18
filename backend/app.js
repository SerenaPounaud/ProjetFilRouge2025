//configuration express
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { corsOptions } from "./cors/cors.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import helmet from 'helmet';
import recipeExterneRoutes from './routes/recipeExterne.routes.js';
import {apiLimiter} from './middlewares/rateLimit.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();
//app.use(cors()); //autorise tout (mode dev)
app.use(cookieParser()); //permet de lire les cookies
app.use(cors(corsOptions));

app.disable("x-powered-by"); //supprime header express
app.use(helmet({ //ajout headers htpp de sécurité
    contentSecurityPolicy: { //Content Security Policy (CSP) pour limiter les sources autorisées et réduire les risques de XSS
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"]
        }
    }
})
);

app.use(express.json({limit: "10kb"})); //permet d'utiliser des données json + protection DOS

//connexion routes
app.use("/api", apiLimiter); //limite le nombre de req globale
app.use("/api", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/recipes/external", recipeExterneRoutes);
if(process.env.NODE_ENV === "test") {app.use("/api/test", testRoutes)};

//récupère tous les messages d'erreurs
app.use(errorHandler);

export default app;