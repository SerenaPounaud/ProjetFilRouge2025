export const transformRecipe = (req, res, next) => {
    const body = req.body;

    if (typeof body.nomRecette === "string") {
        body.nomRecette = body.nomRecette.trim().toLowerCase();
    }

    if (typeof body.img === "string") {
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
            body.ingredients = body.ingredients
            .map(ingredient => ingredient.trim()) //transforme en tableau
            .filter(ingredient => ingredient !== "");
        }
    }

    if (typeof body.instructions === "string") {
        body.instructions = body.instructions.trim();
    }

    //tags : nettoyage tableau
    if (body.tags) {
        if (typeof body.tags === "string") {
            body.tags = [body.tags];
        }

        if (Array.isArray(body.tags)) {
            body.tags = body.tags
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag !== "");
        }
    }
    next();
};