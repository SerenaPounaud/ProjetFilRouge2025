let user = null;

//recupère la chaîne JSON stockée sous la clé commentaires dans localstorage et la transforme en tableau ou ver.vide si null/falsy
let commentaires = JSON.parse(localStorage.getItem("commentaires")) || [];
displayComments(); //affichera les commentaires


// Vider l'input au chargement de la page
window.addEventListener("load", () => {
    const prenomInput = document.getElementById("prenom");
    if (prenomInput) prenomInput.value = ""; //vérifie si il n'est pas null, réinitialise la valeur

    const user = localStorage.getItem("user") || null; //retourne prenom ou null

    const connexionDiv = document.getElementById("connexion");
    const commentaireZone = document.getElementById("zone_commentaire");
    const btnDeconnexion = document.getElementById("btn_deconnexion");

    if (user) {
        connexionDiv.style.display = "none";
        commentaireZone.style.display = "block";
        btnDeconnexion.style.display = "inline-block";
    } else {
        connexionDiv.style.display = "block";
        commentaireZone.style.display = "none";
        btnDeconnexion.style.display = "none";
    }

    // Affiche nombre de caractères
    const commentaireInput = document.getElementById("commentaire_input");
    const charCount = document.getElementById("char_count");

    if (commentaireInput) { //vérifie qu'il existe, évite erreur si élément absent
        commentaireInput.addEventListener("input", () => { //se déclenche à chaque changement du contenu
            if (charCount) { 
                charCount.textContent = `${commentaireInput.value.length} /500`; //met à jour l'affichage
            }
        });
    }
    displayComments();
});

// Notification erreur
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


// Connexion
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
    localStorage.setItem("user", user); //stocke user


    document.getElementById("connexion").style.display = "none"; //cacher après connexion
    document.getElementById("zone_commentaire").style.display = "block"; //basculement connexion -> commentaire
    document.getElementById("btn_deconnexion").style.display = "inline-block";

    const zone = document.getElementById("zone_commentaire");
    zone.removeAttribute("aria-hidden");
    zone.querySelector("textarea").focus(); //met le curseur sur textarea
}

// Déconnexion
function deconnexion() {
    user = null; // réinitialise l'utilisateur
    localStorage.removeItem("user"); //supprime user

    document.getElementById("zone_commentaire").style.display = "none";
    document.getElementById("zone_commentaire").setAttribute("aria-hidden", "true");

    document.getElementById("connexion").style.display = "block";
    document.getElementById("prenom").value = "";
    document.getElementById("btn_deconnexion").style.display = "none";

    toast("Vous êtes déconnecté");
}

// Condition commentaire
function displayComments() {
    const contenu = document.getElementById("commentaires"); //div principale
    contenu.innerHTML = ""; //réinitialise l'affichage
    contenu.setAttribute("aria-live", "polite"); //pas d'interruption brutale

    if(commentaires.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Aucun commentaire"; //variable temporaire
        contenu.appendChild(emptyMsg); //ajoute le p dans contenu
        return;
    }

    commentaires.forEach(c => {
        const div = createCommentElement(c); //retourne un élément html
        contenu.appendChild(div);
    });
}

// Ajouter un commentaire
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

// Supprimer commentaire
function supprimerCommentaire(id) {
    commentaires = commentaires.filter(c => c.id !== id); //filtre le tableau pour trouver l'id
    localStorage.setItem("commentaires", JSON.stringify(commentaires)); //sauvegarde la nouvelle liste dans localstorage
    displayComments();
    toast("Message supprimé");

}

// Div commentaire
function createCommentElement(c) { //c = commentaire
    const div = document.createElement("div"); //div individuel commentaire
    div.className = "divCommentaires"; //assigne une class à div

    const metaDiv = document.createElement("div"); //(utilisateur, date, note, bouton)
    metaDiv.className = "meta";

    const userStrong = document.createElement("strong"); //met en gras le nom de l'utilisateur
    userStrong.textContent = c.newUser;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = `- ${c.date} - `;

    const etoileSpan = document.createElement("span");
    etoileSpan.textContent = "★".repeat(c.note) + "☆".repeat(5 - c.note);
    etoileSpan.setAttribute("aria-label", `Note : ${c.note} sur 5 étoiles`); //ajoute de l'accessibilité

    const btnSupprimer = document.createElement("button");
    btnSupprimer.type = "button"; //évite de soumettre un formulaire si dans form
    btnSupprimer.style.marginLeft = "10px";
    btnSupprimer.style.color = "red";
    btnSupprimer.textContent = "Supprimer";
    btnSupprimer.addEventListener("click", () => { //confirmation pour éviter les erreurs utilisateur
        if(confirm("Voulez-vous supprimer ce commentaire ?")) {
            supprimerCommentaire(c.id);
        }
    });

    metaDiv.append(userStrong, dateSpan, etoileSpan, btnSupprimer); //ajoute tous les éléments à la div

    const messageDiv = document.createElement("div");
    messageDiv.textContent = c.message; //contre XSS

    div.append(metaDiv, messageDiv); //ajouter à la fin
    return div;
};