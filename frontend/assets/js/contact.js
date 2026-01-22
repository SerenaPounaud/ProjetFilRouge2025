const formContact = document.getElementById("form");

function showError (message, errorDivId, inputIds = []) {
    const errorDiv = document.getElementById(errorDivId);
    if (!errorDiv) return;

    //affiche le message d'erreur en rouge
    errorDiv.textContent = message;
    errorDiv.classList.add("error");
    errorDiv.style.display = "block";

    //applique bordure rouge aux champs concernés
    inputIds.forEach(id => {
      const input = document.getElementById(id);
      if (input) input.classList.add("input-error");
    });

    //masque l'erreur après 3s
    setTimeout(() => {
        errorDiv.classList.remove("error");
        errorDiv.style.display = "none";
        inputIds.forEach(id => {
          const input = document.getElementById(id);
          if (input) input.classList.remove("input-error");
        });
    }, 3000);
}

if (formContact) {
    formContact.addEventListener("submit", (e) => {
    e.preventDefault();

    const nom = document.getElementById("lastname").value.trim();
    const prenom = document.getElementById("firstname").value.trim();
    const email = document.getElementById("email").value.trim();
    const rgpd = document.getElementById("rgpd").checked;

    if (!nom) {
        showError ("Veuillez entrer votre nom", "contact_error", ["lastname"]);
        return;
    }
     if (!prenom) {
        showError("Veuillez entrer votre prénom", "contact_error", ["firstname"]);
        return;
    }
    if (!email.includes("@")) {
        showError("Email invalide Ex: exemple@gmail.fr", "contact_error", ["email"]);
        return;
    }
    if (!rgpd) {
        showError("Veuillez consentir au traitement de vos données personnelles", "contact_error", ["rgpd"]);
        return;
    }

    toast("Connexion réussie !");
   formContact.reset();
});
}

fetch("../templates/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    initHeaderSearch();
});

fetch("../templates/footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);
