const app = require("./app");

const PORT = 3306; //mysql

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
    
})//écoute le port