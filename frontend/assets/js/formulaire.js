const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //condition d'email valide
const maxEmailLength = 150;
const minPasswordLength = 8;

// Affichage des erreurs
function showError (message, fieldId) { //fieldId = id du champ concerné
    const errorDiv = document.getElementById(fieldId + "_error"); //afficher l'erreur sur id_error
    if (!errorDiv) return;

    //affiche le message
    errorDiv.textContent = message;
    errorDiv.style.opacity = "1";
    errorDiv.style.visibility = "visible"; //rend visible l'élément en gardant son espace

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
        errorDiv.style.opacity = "0";
        errorDiv.style.visibility = "hidden";
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
    .then(data => header.innerHTML = data);
};

const footer = document.getElementById("footer");
if (footer) {   
    fetch("../templates/footer.html")
    .then(res => res.text())
    .then(data => footer.innerHTML = data);
};