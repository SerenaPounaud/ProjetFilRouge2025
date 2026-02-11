const boutons = document.querySelectorAll('.user_nav button');
const sections = document.querySelectorAll('.section, .section_active');

// Html pour chaque section
const contenuHtml = {
    profil: `
    <h2>Mes informations<h2/>
    <form action="" method="POST" id="profil" novalidate> 
        <h3 class="sr-only">Information utilisateur</h3>

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
    </form>`,
    favoris: `
    <h2>Mes favoris<h2/>
    <ul>
        <li>Recette 1<li/><button type="button" id="btn_delete">Supprimer</button>
        <li>Recette 2<li/><button type="button" id="btn_delete">Supprimer</button>
        <li>Recette 3<li/><button type="button" id="btn_delete">Supprimer</button>
    <ul/>`,
    recettes: `
    <h2>Mes recettes<h2/>
    <form action="" method="POST" id="form_recette" enctype="multipart/form-data" novalidate> 

        <label for="nom_recette">Nom de la recette</label>
        <input type="text" id="nom_recette" name="nom_recette" placeholder="Nom de la recette" maxlength="50" aria-describedby="nom_recette_error" autocomplete="off">
        <div id="nom_recette_error" class="error-message" role="alert"></div>

        <label for="img">Image</label>
        <input type="file" id="img" name="img"aria-describedby="img_recette_error" accept="image/*">
        <div id="img_recette_error" class="error-message" role="alert"></div>

        <label for="cuisson">Temps de cuisson</label>
        <input type="text" id="cuisson" name="cuisson" placeholder="50 min" maxlength="5" aria-describedby="cuisson_error" autocomplete="off">
        <div id = "cuisson_error" class="error-message" role="alert"></div>

        <label for="nb_personnes">Nombre de personnes</label>
        <input type="number" id="nb_personnes" name="nb_personnes" min="1" value="1" aria-describedby="nb_personnes_error" autocomplete="off">
        <div id = "nb_personnes_error" class="error-message" role="alert"></div>

        <label for="ingredients">Ingrédients</label>
        <input type="text" id="ingredients" name="ingredients" placeholder="Min 3 caractères" aria-describedby="ingredients_error" maxlength="20" autocomplete="off">
        <div id = "ingredients_error" class="error-message" role="alert"></div>

        <label for="ingredients">Instructions</label>
        <input type="text" id="ingredients" name="ingredients" placeholder="Min 3 caractères" aria-describedby="ingredients_error" maxlength="20" autocomplete="off">
        <div id = "ingredients_error" class="error-message" role="alert"></div>

        <button type="submit" id="btn_info">Enregistrer</button>
    </form>`
}


fetch("../templates/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    initHeaderSearch();
});

fetch("../templates/footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data)