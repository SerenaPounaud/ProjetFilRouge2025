const formcontact = document.getElementById("form");

function showError (message, fieldId) {
    const errorDiv = document.getElementById(fieldId + "_error");
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.style.opacity = "1";
    errorDiv.style.visibility = "visible";
    errorDiv.style.opacity = "1";

    //applique bordure rouge
    const input = document.getElementById(fieldId);
    if (input) input.classList.add("input-error");

    //masque l'erreur après 3s
    setTimeout(() => {
        errorDiv.style.opacity = "0";
        errorDiv.style.visibility = "hidden";
        if (input) input.classList.remove("input-error");
    }, 3000);
}

if (formcontact) {
    formcontact.addEventListener("submit", (e) => {
      e.preventDefault();

    const nom = document.getElementById("lastname").value.trim();
    const prenom = document.getElementById("firstname").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const rgpd = document.getElementById("rgpd").checked;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const maxEmailLength = 150;
    const maxNameLength = 50;
    const maxMessageLength = 255;

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
    formcontact.reset();
});
}
// Compteur de caractère


  fetch("../templates/header.html")
      .then(res => res.text())
      .then(data => document.getElementById("header").innerHTML = data);

    fetch("../templates/footer.html")
      .then(res => res.text())
      .then(data => document.getElementById("footer").innerHTML = data);