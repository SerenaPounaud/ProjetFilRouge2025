function showError (message, fieldId) {
    const errorDiv = document.getElementById(fieldId);
    if (!errorDiv) return;
    errorDiv.textContent = message;
    errorDiv.style.opacity = "1";
    errorDiv.style.display = "block";

    setTimeout(() => {
        errorDiv.style.opacity = "0";
        errorDiv.style.display = "none";
    }, 3000);
}

// Inscription
document.getElementById("btn_inscription").addEventListener("click", (e) => {
    e.preventDefault(); //empêche 
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm_password").value.trim();
    const cgu = document.getElementById("cgu").checked;

    if (!email) {
        showError("Veuillez entrer votre email", "inscription_error");
        return;
    }
    if (!email.includes("@")) {
        showError("Email invalide", "inscription_error");
        return;
    }
    if (!password) {
        showError("Veuillez entrer un mot de passe", "inscription_error");
        return;
    }
    if (password !== confirmPassword) {
        showError("Les mots de passe ne correspondent pas", "inscription_error");
        return;
    }
    if (!cgu) {
        showError("Veuillez accepter les conditions générales", "inscription_error");
        return;
    }
    toast("inscription réussie !");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirm_password").value = "";
    document.getElementById("cgu").checked = false;
});

// Connexion
document.getElementById("btn_connexion").addEventListener("click", (e) => {
    e.preventDefault(); 
    const email = document.getElementById("login_email").value.trim();
    const password = document.getElementById("login_password").value.trim();

    if (!email || !password) {
        showError ("Veuillez remplir tous les champs", "connexion_error");
        return;
    }
    if (!email.includes("@")) {
        showError("Email invalide", "connexion_error");
        return;
    }

    toast("Connexion réussie !");
    document.getElementById("login_email").value = "";
    document.getElementById("login_password").value = "";
});