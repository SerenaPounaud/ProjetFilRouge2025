import app from "./app.js";
import connectDB from "./config/db.js";

connectDB(); //lance la connexion avec la base de données

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
    
})//écoute le port