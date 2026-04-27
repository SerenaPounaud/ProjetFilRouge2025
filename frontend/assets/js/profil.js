const boutons = document.querySelectorAll('.user_nav button');
const sections = document.querySelectorAll('.section');

// Html pour chaque section
const contenuHtml = {
    profil: `
<h1>Informations du compte</h1>
<div class="profilDiv">       
    <div id='mes_infos'>
        <h2>Mes informations</h2>
        <p>Nom : Séréna</p>
        <p>Prénom : Pounaud</p>
        <p>Email : exemple@gmail.fr</p>
        <p>Mot de passe : **********</p>
    </div>
        <form action="#" method="POST" id="form_profil" novalidate> 
        <h2>Modifier mes informations</h2>

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
</div> `,
    favoris: `
    <section class="favorisDiv">
        <div>
        <h1>Mes recettes favorites</h1>
            <div class="divRecette">
                <div>
                    <h2>Recette 1</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
                <div>
                    <h2>Recette 2</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
                <div>
                    <h2>Recette 3</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
                <div>
                    <h2>Recette 4</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
                <div>
                    <h2>Recette 5</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
                <div>
                    <h2>Recette 6</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
                <div>
                    <h2>Recette 7</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
                <div>
                    <h2>Recette 8</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
                <div>
                    <h2>Recette 9</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
                <div>
                    <h2>Recette 10</h2>
                    <img src="../assets/img/cake.webp" alt="cake">
                    <button type="button" class="btn_delete">Supprimer</button>
                </div>
            </div>
        </div>
    </section>`,
    recettes: `
    <h1>Ajouter ou modifier vos recettes</h1>
    <div class="ajoutRecette">
        <div class="ajoutRecetteForm">
            <h2>Ajouter une recette</h2>
            <form action="" method="POST" id="form_recette" enctype="multipart/form-data" novalidate>

            <div class="divRecetteImg">
                <label for="nom_recette">Nom de la recette</label>
                <input type="text" id="nom_recette" name="nom_recette" placeholder="Nom de la recette" maxlength="30" aria-describedby="nom_recette_error" autocomplete="off">
                <div id="nom_recette_error" class="error-message" role="alert"></div>

                <label for="img">Image</label>
                <input type="file" id="img" name="img" aria-describedby="img_error" accept="image/*">
                <div id="img_error" class="error-message" role="alert"></div>
            </div>
                <fieldset>
                    <legend>Temps de cuisson</legend>
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
                </fieldset>

                <label for="nb_personnes">Nombre de personnes</label>
                <input type="number" id="nb_personnes" name="nb_personnes" min="1" max ="10" value="1" aria-describedby="nb_personnes_error" autocomplete="off">
                <div id = "nb_personnes_error" class="error-message" role="alert"></div>

            <div class="divIngredients">
                <div class="inputIngredients">
                    <label for="ingredients">Ajoutez vos ingrédients et leurs quantités</label>
                    <input type="text" id="ingredients" name="ingredients" placeholder="100g Tomates" aria-describedby="ingredients_error" maxlength="20" autocomplete="off">
                    <button type="button" id="ajout_ingredient" aria-label="Ajouter un ingrédient">Ajouter</button>
                </div>
                <div class="listeIngredients">
                    <div id = "ingredients_error" class="error-message" role="alert"></div>
                    <ul id="ingredient_list"></ul>
                </div> 
            </div>

            <div class="divInstruction">
                <label for="instructions">Instructions</label>
                <textarea id="instructions" name="instructions" placeholder="Etape 1 :..." aria-describedby="instructions_error" maxlength="60000" autocomplete="off"></textarea>
                <div id = "instructions_error" class="error-message" role="alert"></div>
            </div>
            <div class="divMotsCles">
                <div class="inputMotsCles">
                    <label for="mots_cles">Mots clés</label>
                    <input type="text" id="mots_cles" name="mots_cles" placeholder="Ex : Fromage" aria-describedby="mots_cles_error" minlength="3" maxlength="20" autocomplete="off">
                    <button type="button" id="ajout_mot_cle" aria-label="Ajouter un mot clé">Ajouter</button>
                </div>
                <div class="listeMotsCles">
                    <div id = "mots_cles_error" class="error-message" role="alert"></div>
                    <ul id="mot_cle_list"></ul>
                </div>
                
            </div>

                <button type="submit" id="btn_recette">Enregistrer</button>
            </form>
        </div>
        <div class="mesRecettes">
            <h2>Mes recettes :</h2>
            <p>Ici s'afficheront les recettes que l'utilisateur intégrera. On pourra les supprimer ou les modifier ultérieurement</p>
        </div>
    </div>
    `
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
        formProfil();
    }
    if (id === "recettes") {
        formRecette();
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