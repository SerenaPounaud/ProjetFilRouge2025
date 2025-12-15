// Génére un nombre pseudo-aléatoire
function pseudoRandom(seed) { //seed = valeur de départ = id recette(entier)
    const x = Math.sin(seed) * 10000; //calcule le sinus de seed + 10 000 = obtenir ungrand nombre décimal
    return x - Math.floor(x); //garde que la partie décimal
}

// Génére une note
function getNoteRecette(id) {
    return Math.floor(pseudoRandom(id) * 5) +1; //x5 puis arrondit vers le bas +1 pour être entre 1-5
}

function getNbAvis(id) {
    return Math.floor(pseudoRandom(id +1) * 50) +1; //id +1 : éviter nbavis soit = note
}

const prenoms = ["Emma", "Lucas", "Léa", "Hugo", "Chloé", "Louis", "Manon", "Nathan", "Camille", "Jules",
"Sarah", "Tom", "Inès", "Arthur", "Zoé", "Théo", "Clara", "Maxime", "Élise", "Noah"];

const noms = ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Moreau", "Laurent", "Simon",
"Michel", "Lefebvre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier", "Girard", "Bonnet"];

// Sélectionne prenom + nom aléatoire
function getNomPrenom(id) {
    const prenom = prenoms[Math.floor(pseudoRandom(id + 2) * prenoms.length)];
    const nom = noms[Math.floor(pseudoRandom(id + 3) * noms.length)];
    return prenom + " " + nom;
} //pseudoRandom retourne un nombre entre 0-1 puis x par nombre de prenoms/noms. 
 //Math.floor permet d'obtenir un entier valable dans la liste puis on récupère le prenoms/noms dans son tableau
//id +2/3 modifie le seed pour éviter que nom/prenom soit corrélé au prenom/noms

function createNoteBlock(id) {
    const note = getNoteRecette(id);
    const nbAvis = getNbAvis(id);
    const nom = getNomPrenom(id);

    const div = document.createElement('div');
    div.classList.add('note-block');
    div.innerHTML = `
        <span class="etoiles">${"★".repeat(note) + "☆".repeat(5 - note)}</span>
        <span class="nb-avis">(${nbAvis} avis)</span>
        <span class="nom">Créé par ${nom}</span>`;
        div.querySelector('.etoiles').setAttribute('aria-label', `Note : ${note} sur 5 étoiles`);
        return div;
    
}

// Générer un temps de cuisson/nombre de personnes aléatoirement
function generateFixedInfo(id) { //générer des informations basées sur un id
  const num = parseInt(id, 10) || 0; //converti id en nombre entier avec une base décimale 10(=être sûr que la conversion se fasse correctement), s'il ne peut pas => valeur 0
  const temps = 10 + (num % 61); //modulo donne le reste de la division + 10(pour que le résultat soit toujours >= à 10), ça crée un nombre entre 10 et 70
  const personnes = 1 + (num % 6); //donne le reste +1 au reste de la division, crée un chiffre entre 1 et 6
  return { temps, personnes }; //renvoie un objet contenant les deux valeurs
}