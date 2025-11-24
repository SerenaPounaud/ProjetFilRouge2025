let user = null;

let commentaires = JSON.parse(localStorage.getItem("commentaires")) || [];
displayComments(); //recupère la chaîne JSON stockée sous la clé commentaires dans localstorage et la transforme en tableau ou ver.vide si null/falsy
//affichera les commentaires

function connexion() {
    const prenomInput = document.getElementById("prenom");
    const nom = prenomInput.value.trim(); //lit la valeur sans les espaces

    if (!nom) {
        alert("Veuillez entrer un prénom");
        return;
    }

    user = nom; //affecte le prenom si pas d'alerte
    document.getElementById("connexion").style.display = "none"; //cacher après connexion
    document.getElementById("zone_commentaire").style.display = "block"; //basculement connexion -> commentaire
}

function ajoutCommentaire() {
    const text = document.getElementById("commentaire_input").value.trim();
    const noteInput = document.getElementById("note_input").value;
    if (!text) {
        return alert ("Aucun commentaire");
    }
    if (!noteInput) {
        return alert("Veuillez choisir une note avant d'envoyer");
    }
    const note = parseInt(noteInput); //convertit chaine -> entier

    const newCommentaire = { //créer un objet contenant les informations du commentaire
        id: Date.now(), //generer un id basé sur le nombre de millisecondes écoulées 1er janvier 1970 -> aujourd'hui
        newUser: user,
        message: text,
        date: new Date().toLocaleDateString(), //date locale sans l'heure
        note: note
    };

    commentaires.push(newCommentaire); //ajoute à la fin du tableau commentaires
    localStorage.setItem("commentaires",JSON.stringify(commentaires)); //sauvegarde le tableau dans localstorage puis convertit en JSON

    document.getElementById("commentaire_input").value = ""; //réinitialise la valeur après envoi
    document.getElementById("note_input").value = ""; 
    displayComments(); //met à jour l'affichage
}

function supprimerCommentaire(id) {
    commentaires = commentaires.filter(c => c.id !== id); //filtre le tableau pour trouver l'id
    localStorage.setItem("commentaires", JSON.stringify(commentaires)); //sauvegarde la nouvelle liste dans localstorage
    displayComments();
}

// Div commentaire sécurisé
function createCommentElement(c) {
    const div = document.createElement("div");
    div.classname = "divCommentaires"; //assigne une class à div

    const metaDiv = document.createElement("div");
    metaDiv.className = "meta";

    const userStrong = document.createElement("strong");
    userStrong.textContent = c.newuser;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = `- ${c.date} - `;

    const etoileSpan = document.createElement("span");
    etoileSpan.textContent = "★".repeat(c.note) + "☆".repeat(5 - c.note);

    const btnSupprimer = document.createElement("button");
    btnSupprimer.type = "button";
    btnSupprimer.style.marginLeft = "10px";
    btnSupprimer.style.color = "red";
    btnSupprimer.textContent = "Supprimer";
    btnSupprimer.addEventListener("click", () => supprimerCommentaire(c.id));

    metaDiv.append(userStrong, dateSpan, etoileSpan, btnSupprimer);

    const messageDiv = document.createElement("div");
    messageDiv.textContent = c.message; //contre XSS

    div.append(metaDiv, messageDiv);
    return div;
}
function displayComments() {
    const contenu = document.getElementById("commentaires");
    contenu.innerHTML = ""; //réinitialise l'affichage
    contenu.setAttribute("aria-live", "polite");

    commentaires.forEach(c => {
        const div = document.createElement(c);
        contenu.appendChild(div);
    });
}

// Vider l'input au chargement de la page
window.addEventListener("load", () => {
    const prenomInput = document.getElementById("prenom");
    if (prenomInput) prenomInput.value = "";
});