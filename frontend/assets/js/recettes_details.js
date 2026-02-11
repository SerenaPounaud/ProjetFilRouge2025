// Récupérer l'id depuis l'URL
const params = new URLSearchParams(window.location.search); //récupère la partie de l'url après le ?(paramètre de la requête) puis crée un objet pour manipuler ces paramètres
const idMeal = params.get('id'); //récupère la valeur de paramètre id dans l'url
const recipeDetailsDiv = document.getElementById('recettes_details');
const divSimilaires = document.getElementById("recettes_similaires");

// Récupère détails recette
if (!idMeal) { //vérifie si idMeal est vide ou null et affiche un message si c'est vrai
  recipeDetailsDiv.innerHTML = '<p>Aucune recette sélectionnée.</p>';
} else {
  async function getRecipeDetails(id) { //si il existe => fonction asynchrome pour récupérer la recette via l'API
    try { //try pour gérer les erreurs
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`); //récupère les détails de la recette correspondant à l'id
      const data = await response.json(); //transforme la réponse en objet js via .json
      return data.meals ? data.meals[0] : null; //vérifie si data.meals existe, si oui renvoie le premier élément du tableau meals
    } catch (error) {
      console.error('Erreur lors de la récupération de la recette:', error);
      return null; //renvoie null si aucune recette a été recupérée
    }
  }

// Affiche des recettes similaires  
function displayRecettesSimilaire(meals, currentId) {
  divSimilaires.innerHTML = ""; //vide la div pour afficher de nouvelles recettes/mise à jout

  meals.forEach(meal => {
    if (meal.idMeal === currentId) return; //évite d'afficher la recette actuelle

    const card = document.createElement("div");
    card.classList.add("item-similaire");
    card.style.cursor = "pointer";
    card.setAttribute("role", "listitem")

    card.innerHTML = `
    <h4>${meal.strMeal}</h4>
    <img src="${meal.strMealThumb}" width="150">`;

    const noteBlock = createNoteBlock(meal.idMeal);
    card.appendChild(noteBlock);

    card.addEventListener("click", () => { //redirige vers la page détails de la recette
      window.location.href = `./recettes_details.html?id=${meal.idMeal}`;
    });

    divSimilaires.appendChild(card); //ajoute dans la div
  });
}

// Récuperer recettes similaire selon catégories
function fetchRecettesSimilaires(category, currentId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  .then(res => res.json())
  .then(data => {
    if (!data.meals) {
      divSimilaires.innerHTML = "<p>Aucune autre recette trouvée.</p>";
      return;
    }
    const shuffled = data.meals.sort(() => Math.random() -0.5); //mélange les résultats
    const randomFour = shuffled.slice(0, 8); //garde 8 recettes
    
    displayRecettesSimilaire(randomFour, currentId);
  })
  .catch(err => {
    console.error("Erreur similaires :", err);
    divSimilaires.innerHTML = "<p>Impossible de charger les recettes similaires.</p>";
  });
}

// Afficher la recette
getRecipeDetails(idMeal).then(meal => { //appelle la fonction, meal = recevra le résultat
  if (!meal) { //si null ou undefined
    recipeDetailsDiv.innerHTML = '<p>Recette introuvable.</p>';
    return; //quitte la fonction pour éviter que le code continu si meal est absent
  }
  fetchRecettesSimilaires(meal.strCategory, meal.idMeal);
  
  const { heures, minutes, personnes } = generateFixedInfo(idMeal); //déstructuration = 2 variables
  const dateRecette = getDateRecette(idMeal);

  const dateFormatted = dateRecette.toLocaleDateString('fr-FR', { //transforme date en texte lisible pour la france
    day: 'numeric', //affiche le numéro du jour
    month: 'long', //nom complet
    year: 'numeric'//année complète
  });

// Tags
  let tags = [];

  if (meal.strTags) { //si il existe
    let rawTags = meal.strTags.split(','); //découpe le tableau avec des virgules

    let cleandTags = [];
    for (let i =0; i < rawTags.length; i++) {
      let trimmed = rawTags[i].trim(); //parcourt et enlève les espaces
      if (trimmed) {
        cleandTags.push(trimmed); //garde que ceux qui ne sont pas vide
      }
    }
    tags = cleandTags;
  } else {
    tags = []; //si meal.strTags n'existe pas, tags reste un tableau vide
  }
  let tagsHtml = '';
  if (tags.length > 0) {
    tagsHtml = '<h3>Tags :</h3><ul class="tags-list">';
    for (let i =0; i < tags.length; i++) { //créer un li pour chaque tags
      tagsHtml += '<li class="tag">' + tags[i] + '</li>';
    }
    tagsHtml += '</ul>';
  } else {
    tagsHtml = '<p>Aucun tag disponible pour cette recette.</p>'
  }

// HTML des ingrédients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) { //max 20 ingrédients dans l'API
    const ingredient = meal[`strIngredient${i}`]; //récupère l'ingrédient de la recette
    const measure = meal[`strMeasure${i}`]; //récupère les mesures de l'ingrédient

    if (ingredient && ingredient.trim() !== '') { //vérifie si l'ingrédient existe et n'est pas un espace vide
      let text = ingredient;
      if (measure && measure.trim() !== '') {
        text += ' → ' + measure; //on ajoute ingrédient + mesure
      }
        ingredients.push(text); //on push vers le tableau initial
      }
  }
  let ingredientsHtml = '';
  if (ingredients.length === 0) {
    ingredientsHtml = '<li>Aucun ingrédient listé.</li>';
  } else {
    ingredients.forEach(it => { //it = nom de chaque ingrédient
    ingredientsHtml += `<li>${it}</li>`; //+= ajoute à la fin de la chaîne existante
    });
}

// Condition heures et minutes
let afficheTemps;
if (heures > 0) {
  if (minutes === 0) {
    afficheTemps = heures + "h ";
  } else {
    afficheTemps = heures + "h " + minutes;
  }
} else {
  afficheTemps = minutes + " min";
}

// HTML final 
const noteBlock = createNoteBlock(meal.idMeal);
const noteHtml = noteBlock.outerHTML;

recipeDetailsDiv.innerHTML = `

<h2>${meal.strMeal || '—'}</h2>
<p class='date-recette'>Publiée le <strong>${dateFormatted}</strong></p>
<img src="${meal.strMealThumb || ''}" alt="${meal.strMeal || ''}" width="300">
<div>
  <p><strong>Temps de cuisson :</strong> ${afficheTemps}</p>
  <p><strong>Pour :</strong> ${personnes} personne(s)</p>
</div>
  <div class="note">
    ${noteHtml}
    <button type= "button" class="btnDetails" title="Ajouter aux favoris" aria-label="Ajouter aux favoris" style="background: transparent; border: none; padding: 0; cursor: pointer;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="40" height="40">
      <path d="M378.9 64c-32.4 0-62.9 15.6-81.9 41.9l-28 38.7c-3 4.2-7.8 6.6-13 6.6s-10-2.5-13-6.6l-28-38.7c-19-26.3-49.5-41.9-81.9-41.9-55.9 0-101.1 45.3-101.1 101.1 0 55 34.4 107.1 71.8 152.5 42.1 51.2 93.4 96 128.5 122.9 3.8 2.9 8.4 5.1 13.4 6.3 2.9 11.5 6.8 22.6 11.7 33.2-.5 0-.9 0-1.4 0-15.6 0-30.8-4.6-43.1-14.1-36.5-27.9-89.7-74.4-133.8-127.9-37.5-45.5-79.1-105.5-79.1-172.8 0-73.5 59.6-133.1 133.1-133.1 42.7 0 82.8 20.5 107.9 55.1l15 20.7 15-20.7c25-34.6 65.2-55.1 107.9-55.1 73.5 0 133.1 59.6 133.1 133.1 0 19.4-3.5 38.3-9.3 56.3-9.8-3.9-20.1-7-30.6-9.2 5-15.4 7.9-31.1 7.9-47.1 0-55.9-45.3-101.1-101.1-101.1zM544 400a112 112 0 1 0 -224 0 112 112 0 1 0 224 0zm-256 0a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm160-64l0 48 48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-48 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48-48 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l48 0 0-48c0-8.8 7.2-16 16-16s16 7.2 16 16z" fill="red"/>
      </svg>
    </button>
    <button type= "button" class="btnDetails" title ="Imprimer la recette" aria-label="Imprimer la recette" style="background: transparent; border: none; padding: 0; cursor: pointer;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40" height="40"><!--!Font Awesome Pro v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc.-->
      <path d="M64 64C64 28.7 92.7 0 128 0L341.5 0c17 0 33.3 6.7 45.3 18.7l42.5 42.5c12 12 18.7 28.3 18.7 45.3l0 37.5-384 0 0-80zM0 256c0-35.3 28.7-64 64-64l384 0c35.3 0 64 28.7 64 64l0 96c0 17.7-14.3 32-32 32l-32 0 0 64c0 35.3-28.7 64-64 64l-256 0c-35.3 0-64-28.7-64-64l0-64-32 0c-17.7 0-32-14.3-32-32l0-96zM128 416l0 32 256 0 0-96-256 0 0 64zM456 272a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"/>
      </svg>
    </button>
  </div>
    
<div class="middleDetails">
  <div>
    <h3>Instructions :</h3>
    <p>${meal.strInstructions || '<em>Aucune instruction fournie.</em>'}</p> 
  </div>
  <aside>
    <h3>Ingrédients :</h3>
    <ul>
      ${ingredientsHtml}
    </ul>
    ${tagsHtml}
  </aside>
</div>
  `;
});
}//instructions fournit par l'API

// Chargement du header et du footer
fetch("../templates/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    initHeaderSearch();
});

fetch("../templates/footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data)
