let user = null;

let commentaires = JSON.parse(localStorage.getItem("commentaires")) || [];
displayComments(); //recupère la chaîne JSON stockée sous la clé commentaires dans localstorage et la transforme en tableau ou ver.vide si null/falsy
//affichera les commentaires

function showError(message, fieldId) { //fieldId = id de l'élément html où s'affiche le message
        const errorDiv = document.getElementById(fieldId); //cherche l'id
        if (!errorDiv) return; //si id = null = arrête fonction
        errorDiv.textContent = message; //intégre le message d'erreur dedans errorDiv
        errorDiv.style.opacity = "1"; //le rend visible et force sont affichage
        errorDiv.style.display = "block";

        setTimeout(() => { //efface après 3000 millisecondes 
            errorDiv.style.opacity= "0";
            errorDiv.style.display = "none";
        }, 3000);
    }

function toast(message) {
    const t = document.getElementById("toast");
    t.style.transition = "none";
    t.style.opacity = "0";
    t.style.transform = "translateY(20px)";

    void t.offsetWidth; //force reflow pour relancer l'animation

    t.textContent = message;
    t.style.transition = "all 0.3s ease"; //réinitialise
    t.style.opacity = "1";
    t.style.transform = "translateY(0)"; //déplace verticalement, 0 = pas de déplacement

    setTimeout(() => {
        t.style.opacity = "0";
        t.style.transform = "translateY(20px)"; //déplace vers le bas
    }, 3000);
}  

function connexion() {
    const prenomInput = document.getElementById("prenom");
    const nom = prenomInput.value.trim(); //lit la valeur sans les espaces
     if(!nom) {
        prenomInput.classList.add("input-error");
        showError("Veuillez entrer un prénom", "prenom_error");
        return;
     }
     if (nom.length > 50) {
        showError("Prénom trop long", "prenom_error");
        return;
     }
    prenomInput.classList.remove("input-error");

    user = nom; //affecte le prenom si pas d'alerte
    document.getElementById("connexion").style.display = "none"; //cacher après connexion
    document.getElementById("zone_commentaire").style.display = "block"; //basculement connexion -> commentaire
}

function ajoutCommentaire() {
    const text = document.getElementById("commentaire_input").value.trim();
    const noteInput = document.getElementById("note_input").value; //récupère la valeur
    if (!noteInput) {
        showError("Veuillez choisir une note avant d'envoyer", "note_error");
        return;
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
    document.getElementById("char_count").textContent = "0/500";
    toast("Commentaire ajouté");
    displayComments(); //met à jour l'affichage
}

window.addEventListener("load", () => {
    const prenomInput = document.getElementById("prenom");
    if (prenomInput) prenomInput.value = "";

    const commentaireInput = document.getElementById("commentaire_input");
    const charCount = document.getElementById("char_count");

    if (commentaireInput) {
        commentaireInput.addEventListener("input", () => {
            if (commentaireInput.value.length > 500) {
                commentaireInput.value = commentaireInput.value.slice(0, 500);
                showError("Maximum 500 caractères", "commentaire_input");
            }
            charCount.textContent = `${commentaireInput.value.length} /500`;
        });
    }
});

function supprimerCommentaire(id) {
    commentaires = commentaires.filter(c => c.id !== id); //filtre le tableau pour trouver l'id
    localStorage.setItem("commentaires", JSON.stringify(commentaires)); //sauvegarde la nouvelle liste dans localstorage
    displayComments();
    toast("Message supprimé");

}

// Div commentaire sécurisé
function createCommentElement(c) {
    const div = document.createElement("div");
    div.className = "divCommentaires"; //assigne une class à div

    const metaDiv = document.createElement("div");
    metaDiv.className = "meta";

    const userStrong = document.createElement("strong");
    userStrong.textContent = c.newUser;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = `- ${c.date} - `;

    const etoileSpan = document.createElement("span");
    etoileSpan.textContent = "★".repeat(c.note) + "☆".repeat(5 - c.note);
    etoileSpan.setAttribute("aria-label", `Note : ${c.note} sur 5 étoiles`);

    const btnSupprimer = document.createElement("button");
    btnSupprimer.type = "button";
    btnSupprimer.style.marginLeft = "10px";
    btnSupprimer.style.color = "red";
    btnSupprimer.textContent = "Supprimer";
    btnSupprimer.addEventListener("click", () => { //confirmation pour éviter les erreurs utilisateur
        if(confirm("Voulez-vous supprimer ce commentaire ?")) {
            supprimerCommentaire(c.id);
        }
    });

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

    if(commentaires.length === 0) { //lorsqu'il n'y a aucun message
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Aucun commentaire";
        contenu.appendChild(emptyMsg);
        return;
    }

    commentaires.forEach(c => {
        const div = createCommentElement(c);
        contenu.appendChild(div);
    });
}

// Vider l'input au chargement de la page
window.addEventListener("load", () => {
    const prenomInput = document.getElementById("prenom");
    if (prenomInput) prenomInput.value = "";
});