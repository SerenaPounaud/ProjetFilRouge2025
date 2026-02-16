const boutons = document.querySelectorAll('.user_nav button');
const sections = document.querySelectorAll('.section');

// Html pour chaque section
const contenuHtml = {
    profil: `
    <div>
        <h2>Mes informations</h2>
        <div id='mes_infos'>
            <p>Nom : Séréna</p>
            <p>Prénom : Pounaud</p>
            <p>Email : exemple@gmail.fr</p>
            <p>Mot de passe : **********</p>
    </div>
    <div>
        <h3>Mofifier mes informations</h3>
        <form action="" method="POST" id="form_profil" novalidate> 

            <label for="lastname">Nom</label>
            <input type="text" id="lastname" name="lastname" placeholder="Votre nom" maxlength="50" aria-describedby="lastname_error" autocomplete="name">
            <div id="lastname_error" class="error-message" role="alert"></div>

            <label for="firstname">Prénom</label>
            <input type="text" id="firstname" name="firstname" placeholder="Votre prénom" maxlength="50" aria-describedby="firstname_error" autocomplete="given-name">
            <div id="firstname_error" class="error-message" role="alert"></div>

            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="exemple@gmail.fr" maxlength="150" aria-describedby="email_error" autocomplete="email">
            <div id = "email_error" class="error-message" role="alert"></div>

            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" placeholder="Min 8 caractères" aria-describedby="password_error" maxlength="20" autocomplete="current-password">
            <div id = "password_error" class="error-message" role="alert"></div>

            <button type="submit" id="btn_info">Enregistrer</button>
        </form>
    </div>`,
    favoris: `
    <div>
        <h2>Mes favoris</h2>
        <ul>
            <li>Recette 1</li><button type="button" class="btn_delete">Supprimer</button>
            <li>Recette 2</li><button type="button" class="btn_delete">Supprimer</button>
            <li>Recette 3</li><button type="button" class="btn_delete">Supprimer</button>
            <li>Recette 4</li><button type="button" class="btn_delete">Supprimer</button>
            <li>Recette 5</li><button type="button" class="btn_delete">Supprimer</button>
        <ul/>
    </div>`,
    recettes: `
    <div>
        <h2>Ajouter une recette</h2>
        <form action="" method="POST" id="form_recette" enctype="multipart/form-data" novalidate> 

            <label for="nom_recette">Nom de la recette</label>
            <input type="text" id="nom_recette" name="nom_recette" placeholder="Nom de la recette" maxlength="50" aria-describedby="nom_recette_error" autocomplete="off">
            <div id="nom_recette_error" class="error-message" role="alert"></div>

            <label for="img">Image</label>
            <input type="file" id="img" name="img"aria-describedby="img_recette_error" accept="image/*">
            <div id="img_recette_error" class="error-message" role="alert"></div>

            <h4>Temps de cuisson</h4>
            <label for="cuisson_h">Heures :</label>
            <select id="cuisson_h" name="cuisson_h">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <div id = "cuisson_h_error" class="error-message" role="alert"></div>

            <label for="cuisson_m">Minutes :</label>
            <select id="cuisson_m" name="cuisson_m">
                <option value="0">0</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="50">50</option>
                <option value="55">55</option>
            </select>
            <div id = "cuisson_m_error" class="error-message" role="alert"></div>

            <label for="nb_personnes">Nombre de personnes</label>
            <input type="number" id="nb_personnes" name="nb_personnes" min="1" max ="10" value="1" aria-describedby="nb_personnes_error" autocomplete="off" maxlength="10" minlength="1">
            <div id = "nb_personnes_error" class="error-message" role="alert"></div>

            <label for="ingredients">Ingrédients</label>
            <input type="text" id="ingredients" name="ingredients" placeholder="Ajouter un ingrédient" aria-describedby="ingredients_error" maxlength="20" autocomplete="off">
            <button type="button" id="ajout_ingredient">Ajouter</button>
            <ul id="ingredient_list"></ul>
            <div id = "ingredients_error" class="error-message" role="alert"></div>

            <label for="insctructions">Instructions</label>
            <textarea type="text" id="instructions" name="instructions" placeholder="Etape 1 :..." aria-describedby="instruction_error" maxlength="60000" autocomplete="off"></textarea>
            <div id = "instructions_error" class="error-message" role="alert"></div>

            <label for="mots_cles">Mots clés</label>
            <input type="text" id="mots_cles" name="mots_cles" placeholder="Ex : Fromage" aria-describedby="mots_cles_error" minlength="3" maxlength="20" autocomplete="off">
            <button type="button" id="ajout_mot_cle">Ajouter</button>
            <ul id="mot_cle_list"></ul>
            <div id = "mots_cles_error" class="error-message" role="alert"></div>

            <button type="submit" id="btn_recette">Enregistrer</button>
        </form>
    </div>
    <div>
        <h2>Mes recettes :</h2>
        <p>Ici s'afficheront les recettes que l'utilisateur intégrera. On pourra les supprimer ou les modifier ultérieurement</p>
    </div>`
}

// Affiche la section sélectionné
function afficheSection(id) {
    sections.forEach(section => {
        if (section.id === id) {
            if (!section.dataset.loaded) {
                section.innerHTML = contenuHtml[id];
                section.dataset.loaded = "true";
            }
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
    if (id === "profil") {
        FormProfil();
    }
    // Bouton actif
    boutons.forEach(button => {
        if (button.dataset.target === id) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Evenement de changement de section
boutons.forEach(button => {
    button.addEventListener('click', () => {
        afficheSection(button.dataset.target);
    });
});
afficheSection('profil'); //affichage par défaut