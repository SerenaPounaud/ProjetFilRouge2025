const app = require("./app");
const connecDB = require("./config/db");

connecDB(); //lance la connexion vers la bd

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
    
})//écoute le port