let user = null;
const prenomInput = document.getElementById("prenom");
const commentaireInput = document.getElementById("commentaire_input");
const noteInput = document.getElementById("note_input");

//recupère la chaîne JSON stockée sous la clé commentaires dans localstorage et la transforme en tableau ou ver.vide si null/falsy
let commentaires = JSON.parse(localStorage.getItem("commentaires")) || [];
displayComments(); //affichera les commentaires


// Condition d'affichage zone commentaire
function conditionCommentaire() {
    const connexionDiv = document.getElementById("connexion");
    const commentaireZone = document.getElementById("zone_commentaire");
    const btnDeconnexion = document.getElementById("btn_deconnexion");

    if (user) {
        connexionDiv.style.display = "none";
        commentaireZone.style.display = "block";
        btnDeconnexion.style.display = "inline-block";
        commentaireZone.removeAttribute("aria-hidden");
    } else {
        connexionDiv.style.display = "block";
        commentaireZone.style.display = "none";
        btnDeconnexion.style.display = "none";
        commentaireZone.setAttribute("aria-hidden", "true");
    }
}

// Vider l'input au chargement de la page
window.addEventListener("load", () => {
    if (prenomInput) prenomInput.value = ""; //si il existe, réinitialise la valeur

    user = localStorage.getItem("user"); //retourne prenom ou rien
    conditionCommentaire();

    // Affiche nombre de caractères
    const charCount = document.getElementById("char_count");
    const maxcommentaireLength = 500;

    if (commentaireInput) {
        commentaireInput.addEventListener("input", () => { //se déclenche à chaque changement du contenu
            if (charCount) { 
                charCount.textContent = `${commentaireInput.value.length} / ${maxcommentaireLength}`;
            }
        });
    }
    displayComments();
});

// Notification erreur
function showError(message, fieldId) { //fieldId = id de l'élément html où s'affiche le message
        const errorDiv = document.getElementById(fieldId + "_error"); //afficher l'erreur sur id_error
        if (!errorDiv) return;

        errorDiv.textContent = message; //intégre le message d'erreur dans errorDiv
        errorDiv.classList.add("visible");

        //applique style
        const input = document.getElementById(fieldId);
        if (input) {
            input.classList.add("input-error"); //ajoute une classe si il existe
            input.setAttribute("aria-invalid", "true"); //indique au lecteur d'écran un champ incorrect
            if (input.tagName.toLowerCase() !== "select")input.focus();
        }

        //masque l'erreur après 5s
        setTimeout(() => {
        errorDiv.classList.remove("visible");
        if (input){
                input.classList.remove("input-error");
                input.removeAttribute("aria-invalid");
            }
        }, 5000);
    };

// Connexion
function connexion() {
    const prenom = prenomInput.value.trim();
     if(!prenom) {
        showError("Veuillez entrer un prénom", "prenom");
        return;
     }
     if (prenom.length > 50) {
        showError("Prénom trop long", "prenom");
        return;
     }
    user = prenom;
    localStorage.setItem("user", user); //stocke user

    conditionCommentaire();
    document.querySelector("#zone_commentaire textarea").focus();
}

// Déconnexion
function deconnexion() {
    user = null; // réinitialise l'utilisateur
    localStorage.removeItem("user"); //supprime user du localstorage
    conditionCommentaire();
    document.getElementById("prenom").value = "";

    toast("Vous êtes déconnecté");
}

// Condition commentaire
function displayComments() {
    const contenu = document.getElementById("commentaires");
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
    const text = commentaireInput.value.trim();
    const noteInputValue = noteInput.value;
    if (!noteInputValue) {
        showError("Veuillez choisir une note avant d'envoyer", "note_input");
        return;
    }
    const note = parseInt(noteInputValue); //convertit chaine -> entier

    const newCommentaire = { //créer un objet contenant les informations du commentaire
        id: Date.now(), //generer un id basé sur le nombre de millisecondes écoulées 1er janvier 1970 -> aujourd'hui
        newUser: user,
        message: text,
        date: new Date().toLocaleDateString(), //date locale sans l'heure
        note: note
    };

    commentaires.push(newCommentaire); //ajoute à la fin du tableau commentaires
    localStorage.setItem("commentaires",JSON.stringify(commentaires)); //sauvegarde le tableau dans localstorage puis convertit en JSON

    //réinitialise la valeur après envoi
    commentaireInput.value = "";
    noteInput.value = "";
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
    div.className = "divCommentaires";

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