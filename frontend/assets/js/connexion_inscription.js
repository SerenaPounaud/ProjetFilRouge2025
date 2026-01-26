const formInscription = document.getElementById("form");
const formConnexion = document.getElementById("formconnexion");

function showError (message, fieldId) {
    const errorDiv = document.getElementById(fieldId + "_error");
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.style.opacity = "1";
    errorDiv.style.visibility = "visible";

    //applique le style
    const input = document.getElementById(fieldId);
    if (input) {
        if (input.type === "checkbox") {
            input.classList.add("cgu-error");
        } else {
        input.classList.add("input-error");
        }
    }

    //masque l'erreur après 5s
    setTimeout(() => {
        errorDiv.style.opacity = "0";
        errorDiv.style.visibility = "hidden";
        if (input) {
            if (input.type == "checkbox") {
                input.classList.remove("cgu-error");
            } else {
            input.classList.remove("input-error");
            }
        }
    }, 5000);
}

// Inscription
if (formInscription) {
    formInscription.addEventListener("submit", (e) => {
    e.preventDefault(); //empêche le rechargement de la page

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm_password").value.trim();
    const cgu = document.getElementById("cgu").checked;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minPasswordLength = 8;
    const maxPasswordLength = 20;
    const maxEmailLength = 150;

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
        showError("Les mots de passe ne correspondent pas","password","confirm_password");
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
if (formConnexion) {
    formConnexion.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minPasswordLength = 8;
    const maxEmailLength = 150;

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