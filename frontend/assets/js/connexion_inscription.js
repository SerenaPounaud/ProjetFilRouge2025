const btnInscription = document.getElementById("btn_inscription");
const btnConnexion = document.getElementById("btn_connexion");

function showError (message, fieldId, inputIds = []) {
    const errorDiv = document.getElementById(fieldId);
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.classList.add("error");
    errorDiv.style.opacity = "1";
    errorDiv.style.display = "block";
    //applique bordure rouge
    const inputs = inputIds.map(id => document.getElementById(id)).filter(el => el !== null);
    inputs.forEach(input => input.classList.add("input-error"));
    //masque l'erreur après 3s
    setTimeout(() => {
        errorDiv.style.opacity = "0";
        errorDiv.classList.remove("error");
        errorDiv.style.display = "none";
    
        inputs.forEach(input => input.classList.remove("input-error"));
    }, 3000);
}

// Inscription
if (btnInscription) {
    btnInscription.addEventListener("click", (e) => {
    e.preventDefault(); //empêche 

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm_password").value.trim();
    const cgu = document.getElementById("cgu").checked;

    if (!email) {
        showError("Veuillez entrer votre email", "inscription_error", ["email"]);
        return;
    }
    if (!email.includes("@")) {
        showError("Email invalide Ex: exemple@gmail.fr", "inscription_error", ["email"]);
        return;
    }
    if (!password) {
        showError("Veuillez entrer un mot de passe", "inscription_error", ["password"]);
        return;
    }
    if (password !== confirmPassword) {
        showError("Les mots de passe ne correspondent pas", "inscription_error", ["password","confirm_password"]);
        return;
    }
    if (!cgu) {
        showError("Veuillez accepter les conditions générales", "inscription_error", ["cgu"]);
        return;
    }
    toast("Inscription réussie !");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirm_password").value = "";
    document.getElementById("cgu").checked = false;
});
}

// Connexion
if (btnConnexion) {
    btnConnexion.addEventListener("click", (e) => {
    e.preventDefault();

    const email = document.getElementById("login_email").value.trim();
    const password = document.getElementById("login_password").value.trim();

    if (!email) {
        showError ("Veuillez remplir le champ", "connexion_error", ["login_email"]);
        return;
    }
     if (!password) {
        showError("Veuillez remplir le champ", "connexion_error", ["login_password"]);
        return;
    }
    if (!email.includes("@")) {
        showError("Email invalide", "connexion_error", ["login_email"]);
        return;
    }

    toast("Connexion réussie !");
    document.getElementById("login_email").value = "";
    document.getElementById("login_password").value = "";
});
}