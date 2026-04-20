const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //condition d'email valide
const maxEmailLength = 150;
const minPasswordLength = 8;
const maxNameLength = 50;

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

//Supprime les erreurs après un submit
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
    e.preventDefault();

    const nom = document.getElementById("lastname").value.trim();
    const prenom = document.getElementById("firstname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm_password").value.trim();
    const cgu = document.getElementById("cgu").checked;
    const maxPasswordLength = 20;

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

// Profil
function formProfil() {
    const formProfil = document.getElementById('form_profil');
    if (!formProfil) return;
    if (formProfil.dataset.initialized) return; //évite plusieurs submit car section injectée dynamiquement
    formProfil.dataset.initialized = "true";

        formProfil.addEventListener("submit", (e) => {
        e.preventDefault();

        const nom = document.getElementById("lastname").value.trim();
        const prenom = document.getElementById("firstname").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

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
        toast("Informations modifiés !");
        formProfil.reset();
    });
    // Supprimer erreur si correction
    document.querySelectorAll("input").forEach(field => {
    field.addEventListener("input",() => {
        const error = document.getElementById(field.id + "_error");
        if (error) error.classList.remove("visible");
        field.classList.remove("input-error");
        field.removeAttribute("aria-invalid");
    });
});
}

// Intégration recette
function formRecette() {
    const formrecette = document.getElementById('form_recette');
    if (!formrecette) return;
    if (formrecette.dataset.initialized) return; //évite plusieurs submit car section injectée dynamiquement
    formrecette.dataset.initialized = "true";

        const maxIngreLength = 20;
        const inputIngredients = document.getElementById("ingredients");
        const btnAjoutIngredient = document.getElementById("ajout_ingredient");
        const ingredientsListe = document.getElementById("ingredient_list");
        const inputMotsCles = document.getElementById("mots_cles");
        const btnAjoutMotCle = document.getElementById("ajout_mot_cle");
        const motsClesListe = document.getElementById("mot_cle_list");

        let tabIngredients = [];
        let tabMotsCles = [];

        if (!inputIngredients || !btnAjoutIngredient || !ingredientsListe) return;
        if (!inputMotsCles || !btnAjoutMotCle || !motsClesListe) return;

        // Ajout liste d'ingrédients
        btnAjoutIngredient.addEventListener("click", () => {
            const valeur = inputIngredients.value.trim();
        if (!valeur) {
            showError("Veuillez écrire vos ingrédients", "ingredients");
            return;
        }
        if (valeur.length > maxIngreLength) {
            showError(`Le nom ne peut pas dépasser ${maxIngreLength} caractères`, "ingredients");
            return;
        }
        if (tabIngredients.includes(valeur)) {
            showError("Ingrédient déjà ajouté", "ingredients");
            return;
}
        clearErrors();

        tabIngredients.push(valeur);
        
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = valeur;
        span.className = "texteIngredient";

        const btnSupprimer = document.createElement("button");
        btnSupprimer.textContent = "Supprimer";
        btnSupprimer.type = "button";
        btnSupprimer.className = "btnListe";

        btnSupprimer.addEventListener("click", () => {
            li.remove();
            tabIngredients = tabIngredients.filter(i => i !== valeur);
        });

            li.appendChild(span);
            li.appendChild(btnSupprimer);
            ingredientsListe.appendChild(li);

            inputIngredients.value = "";
        });

        //ajout mots-clés
        btnAjoutMotCle.addEventListener("click", () => {
            const valeur = inputMotsCles.value.trim();

            if (!valeur) {
                showError("Veuillez écrire un mot-clé", "mots_cles");
                return;
            }

            if (valeur.length > maxIngreLength) {
                showError(`Le mot-clé ne peut pas dépasser ${maxIngreLength} caractères`, "mots_cles");
                return;
            }

            if (tabMotsCles.includes(valeur)) {
                showError("Mot-clé déjà utilisé", "mots_cles");
                return;
            }

            clearErrors();

            tabMotsCles.push(valeur);

            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = valeur;
            span.className = "texteTags";

            const btnSupprimer = document.createElement("button");
            btnSupprimer.textContent = "Supprimer";
            btnSupprimer.type = "button";
            btnSupprimer.className = "btnTags";

            btnSupprimer.addEventListener("click", () => {
                li.remove();
                tabMotsCles = tabMotsCles.filter(m => m !== valeur);
            });

            li.appendChild(span);
            li.appendChild(btnSupprimer);
            motsClesListe.appendChild(li);

            inputMotsCles.value = "";
        });

            formrecette.addEventListener("submit", (e) => {
            e.preventDefault();
            const maxTextearea = 60000;
            const maxPersonnesLength = 10
            const minPersonnesLength = 1
            const nomRecette = document.getElementById("nom_recette").value.trim();
            const img = document.getElementById("img");
            const select_H = document.getElementById("cuisson_h");
            const select_M = document.getElementById("cuisson_m");
            const m = select_M.value;
            const h = select_H.value;
            const nb_personnes_input = document.getElementById("nb_personnes").value.trim();
            const nb_personnes = Number(nb_personnes_input);
            const instructions = document.getElementById("instructions").value.trim();

            if (!nomRecette) {
                showError ("Veuillez entrer un nom pour la recette", "nom_recette");
                return;
            }
            if (nomRecette.length > maxNameLength) {
                showError (`Le nom ne doit pas dépasser ${maxNameLength} caractères`, "nom_recette");
                return;
            }
            if (img.files.length === 0) {
                showError("Veuillez téléverser une image", "img");
                return;
            }
            const fichier = img.files[0]; // vérifie que c'est une image
            if (!fichier.type.startsWith("image/")) {
                showError("Le fichier doit être une image", "img");
                return;
            }
            if (h === "0" && m === "0") {
                showError ("Veuillez indiquer un temps de cuisson", "cuisson_h");
                showError ("", "cuisson_m"); //supprime le message après 5s
                //affiche les deux selects en rouge
                select_H.classList.add("input-error");
                select_M.classList.add("input-error");
                return;
            }
            if (!nb_personnes_input || isNaN(nb_personnes)) { //vérifie si champ vide ou entrée non numérique
                showError ("Veuillez indiquer le nombre de personnes", "nb_personnes");
                return;
            }
            if (nb_personnes < minPersonnesLength || nb_personnes > maxPersonnesLength) {
                showError(`Le nombre de personnes doit être compris entre ${minPersonnesLength} et ${maxPersonnesLength} personnes`, "nb_personnes");
                return;
            }
            if (tabIngredients.length === 0) {
                showError("Veuillez écrire vos ingrédients", "ingredients");
                return;
            }
            if (!instructions) {
                showError("Veuillez inscrire les instructions de la recette", "instructions");
                return;
            }
            if (instructions.length > maxTextearea) {
                showError(`Les instructions ne peuvent excéder ${maxTextearea} caractères`, "instructions");
                return;
            }
            if (tabMotsCles.length === 0) {
                showError("Veuillez inscrire des mots-clés", "mots_cles");
                return;
            }
            clearErrors();
            toast("Recette ajoutée !");
            formrecette.reset();
            ingredientsListe.innerHTML = "";
            tabIngredients.length = 0;
            motsClesListe.innerHTML = "";
            tabMotsCles.length = 0;
        });
    inputIngredients.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            btnAjoutIngredient.click();
        }
    });
        inputMotsCles.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            btnAjoutMotCle.click();
        }
    });
    
    // Supprimer erreur si correction
    document.querySelectorAll("input, select, textarea").forEach(field => {
    field.addEventListener("input",() => {
        const error = document.getElementById(field.id + "_error");
        if (error) error.classList.remove("visible");
        field.classList.remove("input-error");
        field.removeAttribute("aria-invalid");
    });
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