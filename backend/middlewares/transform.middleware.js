export const transformRecipe = (req, res, next) => {
    const body = req.body;

    if (body.nomRecette) {
        body.nomRecette = body.nomRecette.trim().toLowerCase();
    }

    if (body.img) {
        body.img = body.img.trim();
    }

    if (body.heures !== undefined && body.minutes !== undefined) {
    //conversion en nombres
    const heures = Number(body.heures);
    let minutes = Number(body.minutes);

    //transforme 5 -> "05"
    if (minutes < 10) {
        minutes = "0" + minutes;
    } else {
        minutes = String(minutes);
    }
    //champ final
    body.temps = heures + "h" + minutes;
    }

    //nbPersonnes : conversion en nombre
    if (body.nbPersonnes !== undefined) {
        body.nbPersonnes = Number(body.nbPersonnes);
    }

    //ingredients : nettoyage tableau
    if (body.ingredients) {
        //transforme une chaîne de caractères en tableau contenant cette chaîne
        if (typeof body.ingredients === "string") {
            body.ingredients = [body.ingredients];
        }

        if (Array.isArray(body.ingredients)) {
            const newIngredients = [];

            for (let i = 0; i < body.ingredients.length; i++) {
                let ingredient = body.ingredients[i];

                if (ingredient) {
                    ingredient = ingredient.trim();

                    if (ingredient !== "") {
                        newIngredients.push(ingredient);
                    }
                }
            }
            body.ingredients = newIngredients;
        }
    }

    if (body.instructions) {
        body.instructions = body.instructions.trim();
    }

    //motsCles : nettoyage tableau
    if (body.motsCles) {
        if (typeof body.motsCles === "string") {
            body.motsCles = [body.motsCles];
        }

        if (Array.isArray(body.motsCles)) {
            const newMotsCles = [];

            for (let i = 0; i < body.motsCles.length; i++) {
                let mot = body.motsCles[i];

                if (mot) {
                    mot = mot.trim().toLowerCase();

                    if (mot !== "") {
                        newMotsCles.push(mot);
                    }
                }
            }
            body.motsCles = newMotsCles;
        }
    }

    next();
};