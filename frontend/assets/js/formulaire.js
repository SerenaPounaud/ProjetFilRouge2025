const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //condition d'email valide
const maxEmailLength = 150;
const minPasswordLength = 8;

// Affichage des erreurs
function showError (message, fieldId) { //fieldId = id du champ concerné
    const errorDiv = document.getElementById(fieldId + "_error"); //afficher l'erreur sur id_error
    if (!errorDiv) return;

    //affiche le message
    errorDiv.textContent = message;
    errorDiv.classList.add("visible");

    //applique style
    const input = document.getElementById(fieldId);
    if (input) {
        if (input.type === "checkbox") {
        if (fieldId === "cgu") input.classList.add("cgu-error");
        if (fieldId === "rgpd") input.classList.add("rgpd-error");
        } else {
            input.classList.add("input-error"); //ajoute une classe si il existe
            input.setAttribute("aria-invalid", "true"); //indique au lecteur d'écran un champ incorrect
        };
        input.focus();
    }

    //masque l'erreur après 5s
    setTimeout(() => {
        errorDiv.classList.remove("visible");
        if (input) {
            if (input.type == "checkbox") {
                input.classList.remove("rgpd-error", "cgu-error");
            } else {
                input.classList.remove("input-error");
                input.removeAttribute("aria-invalid");
            }
        }
    }, 5000);
};

//Supprimer les erreurs
function clearErrors() {
    document.querySelectorAll(".error.visible").forEach(error => { //message visible d'erreur
        error.classList.remove("visible");        
    });
    document.querySelectorAll(".input-error").forEach(input => { //champs d'erreur
        input.classList.remove("input-error");
        input.removeAttribute("aria-invalid");
    });
    document.querySelectorAll(".rgpd-error, .cgu-error").forEach(checkbox => { //style checkbox
            checkbox.classList.remove("rgpd-error", "cgu-error");
    });
};
//Supprime l'erreur si :
    //on écrit dans textarea
document.querySelectorAll("input:not([type='checkbox']), textarea").forEach(field => {
    field.addEventListener("input",() => {
        const error = document.getElementById(field.id + "_error");
        if (error) error.classList.remove("visible");
        field.classList.remove("input-error");
        field.removeAttribute("aria-invalid");
    });
});
    //checkox coché
document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const errorCheckbox = document.getElementById(checkbox.id + "_error");
        if (checkbox.checked && errorCheckbox) {
            errorCheckbox.classList.remove("visible");
            checkbox.classList.remove("rgpd-error", "cgu-error");
        }
    });
});

// Inscription
const formInscription = document.getElementById("forminscription");
if (formInscription) {
    formInscription.addEventListener("submit", (e) => {
    e.preventDefault(); //empêche d'envoyer au backend

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm_password").value.trim();
    const cgu = document.getElementById("cgu").checked;
    const maxPasswordLength = 20;

    if (!email) {
        showError("Veuillez entrer votre email", "email");
        return;
    }
    if (!emailRegex.test(email)) {
        showError("Email invalide Ex: exemple@gmail.fr", "email");
        return;
    }
     if (email.length > maxEmailLength) {
        showError(`L'email ne doit pas contenir plus de ${maxEmailLength} caractères`, "email");
        return;
    }
    if (!password) {
        showError("Veuillez entrer un mot de passe", "password");
        return;
    }
    if (password.length < minPasswordLength) {
        showError(`Le mot de passe doit contenir minimum ${minPasswordLength} caractères`, "password");
        return;
    }
    if (password.length > maxPasswordLength) {
        showError(`Le mot de passe doit contenir maximum ${maxPasswordLength} caractères`, "password");
        return;
    }
    if (password !== confirmPassword) {
        showError("Les mots de passe ne correspondent pas","confirm_password");
        return;
    }
    if (!cgu) {
        showError("Veuillez accepter les conditions générales","cgu");
        return;
    }
    clearErrors();
    toast("Inscription réussie !");
    formInscription.reset();
});
}

// Connexion
const formConnexion = document.getElementById("formconnexion");
if (formConnexion) {
    formConnexion.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email) {
        showError ("Veuillez entrer votre email", "email");
        return;
    }
    if (!emailRegex.test(email)) {
        showError("Email invalide Ex: exemple@gmail.fr", "email");
        return;
    }
    if (email.length > maxEmailLength) {
        showError(`L'email ne doit pas contenir plus de ${maxEmailLength} caractères`, "email");
        return;
    }
     if (!password) {
        showError("Veuillez entrer votre mot de passe", "password");
        return;
    }
    if (password.length < minPasswordLength) {
        showError(`Le mot de passe doit contenir minimum ${minPasswordLength} caractères`, "password");
        return;
    }
    clearErrors();
    toast("Connexion réussie !");
    formConnexion.reset();
});
}

// Contact
const formcontact = document.getElementById("formcontact");
const charCount = document.getElementById("char_count");
const messageInput = document.getElementById("message");
const maxMessageLength = 255;

if (formcontact) {
    formcontact.addEventListener("submit", (e) => {
      e.preventDefault();

    const nom = document.getElementById("lastname").value.trim();
    const prenom = document.getElementById("firstname").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const rgpd = document.getElementById("rgpd").checked;
    const maxNameLength = 50;

    if (!nom) {
        showError ("Veuillez entrer votre nom", "lastname");
        return;
    }
    if (nom.length > maxNameLength) {
        showError (`Le nom ne doit pas dépasser ${maxNameLength} caractères`, "lastname");
        return;
    }
     if (!prenom) {
        showError("Veuillez entrer votre prénom", "firstname");
        return;
    }
    if (prenom.length > maxNameLength) {
        showError (`Le prénom ne doit pas dépasser ${maxNameLength} caractères`, "firstname");
        return;
    }
    if (!email) {
        showError("Veuillez entrer votre email", "email");
        return;
    }
    if (!emailRegex.test(email)) {
        showError("Email invalide Ex: exemple@gmail.fr", "email");
        return;
    }
    if (email.length > maxEmailLength) {
        showError(`L'email ne doit pas contenir plus de ${maxEmailLength} caractères`, "email");
        return;
    }
    if (!message) {
        showError("Veuillez écrire votre message", "message");
        return;
    }
    if (message.length > maxMessageLength) {
        showError (`Le message ne doit pas dépasser ${maxMessageLength} caractères`, "message");
        return;
    }
    if (!rgpd) {
        showError("Veuillez consentir au traitement de vos données personnelles","rgpd");
        return;
    }
    clearErrors();
    toast("Message envoyé !");
    charCount.textContent = `0/${maxMessageLength}`; //remet à zéro le compteur
    formcontact.reset();
});
}

// Compteur de caractère
if (messageInput && charCount) {
    messageInput.addEventListener("input", () => {
        const length = messageInput.value.length;
        charCount.textContent = `${length} / ${maxMessageLength}`;
    })
};

const header = document.getElementById("header");
if (header) {
    fetch("../templates/header.html")
    .then(res => res.text())
    .then(data => {
    document.getElementById("header").innerHTML = data;
    initHeaderSearch();
});
}

const footer = document.getElementById("footer");
if (footer) {   
    fetch("../templates/footer.html")
    .then(res => res.text())
    .then(data => footer.innerHTML = data);
};