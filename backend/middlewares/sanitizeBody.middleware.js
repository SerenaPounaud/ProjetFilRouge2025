import xss from 'xss';

const sanitizeValue = (value) => {
    if (typeof value === "string") {
        return xss(value); //retourne la valeur nettoyée
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue); //chaque élément du tableau est nettoyé
    }
    if (value && typeof value === "object") {
        return Object.fromEntries( //transforme en objet
            Object.entries(value).map(([key, val]) => [key, sanitizeValue(val)]) //transforme en tableau de paires + nettoyage
        );
    }
    return value;
}

//évite injection html + xss
export const sanitizeBody = (allowedFields) => {
    return (req, res, next) => {
        if(!req.body || typeof req.body !== "object") return next();

    req.body = Object.fromEntries(Object.entries(req.body) //transforme objet en tableau
        //garde uniquement les champs autorisés
        .filter(([key]) => allowedFields.includes(key)) //récupère seulement la première valeur du tableau
        //nettoie les valeurs texte
        .map(([key, value]) => [key, sanitizeValue(value)])
        );//puis reconvertit en objet
    next();
    };
};