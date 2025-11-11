// Récupérer l'id depuis l'URL
const params = new URLSearchParams(window.location.search); //récupère la partie de l'url après le ?(paramètre de la requête) puis crée un objet pour manipuler ces paramètres
const idMeal = params.get('id'); //récupère la valeur de paramètre id dans l'url

const recipeDetailsDiv = document.getElementById('recettes_details');

if (!idMeal) { //vérifie si idMeal est vide ou null et affiche un message si c'est vrai
  recipeDetailsDiv.innerHTML = '<p>Aucune recette sélectionnée.</p>';
} else {
  async function getRecipeDetails(id) { //si il existe => fonction asynchrome pour récupérer la recette via l'API
    try {                              //try pour gérer les erreurs
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`); //récupère les détails de la recette correspondant à l'id
      const data = await response.json(); //transforme la réponse en objet js via .json
      return data.meals ? data.meals[0] : null; //vérifie si data.meals existe, si oui renvoie le premier élément du tableau meals
    } catch (error) {
      console.error('Erreur lors de la récupération de la recette:', error);
      return null; //renvoie null si aucune recette a été recupérée
    }
  }

  // Générer un temps de cuisson/nombre de personnes aléatoirement
  function generateFixedInfo(id) { //générer des informations basées sur un id
    const num = parseInt(id, 10) || 0; //converti id en nombre entier avec une base décimale 10(=être sûr que la conversion se fasse correctement), s'il ne peut pas => valeur 0
    const temps = 10 + (num % 61); //modulo donne le reste de la division + 10(pour que le résultat soit toujours >= à 10), ça crée un nombre entre 10 et 70
    const personnes = 1 + (num % 4); //donne le reste +1 au reste de la division, ça crée un nombre entre 1 et 4
    return { temps, personnes }; //renvoie un objet contenant les deux valeurs
  }

  // Afficher la recette
  getRecipeDetails(idMeal).then(meal => {
    if (!meal) {
      recipeDetailsDiv.innerHTML = '<p>Recette introuvable.</p>';
      return;
    }

    const { temps, personnes } = generateFixedInfo(idMeal);

    // Tags
    const tags = meal.strTags
      ? meal.strTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    let tagsHtml = '';
    if (tags.length > 0) {
      tagsHtml = '<h3>Tags :</h3><ul class="tags-list">';
      tagsHtml += tags.map(tag => `<li class="tag">${tag}</li>`).join('');
      tagsHtml += '</ul>';
    } else {
      tagsHtml = '<p><em>Aucun tag disponible pour cette recette.</em></p>';
    }

    // ------ Construire HTML des ingrédients ------
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(`${ingredient}${measure ? ' - ' + measure : ''}`);
      }
    }
    const ingredientsHtml = ingredients.length
      ? ingredients.map(it => `<li>${it}</li>`).join('')
      : '<li>Aucun ingrédient listé.</li>';

    // ------ Injecter le HTML final ------
    recipeDetailsDiv.innerHTML = `
      <h2>${meal.strMeal || '—'}</h2>
      <img src="${meal.strMealThumb || ''}" alt="${meal.strMeal || ''}" width="300">
      <p><strong>Temps de cuisson :</strong> ${temps} min</p>
      <p><strong>Pour :</strong> ${personnes} personne(s)</p>

      <h3>Instructions :</h3>
      <p>${meal.strInstructions || '<em>Aucune instruction fournie.</em>'}</p>

      <h3>Ingrédients :</h3>
      <ul>
        ${ingredientsHtml}
      </ul>

      ${tagsHtml}
    `;
  });
}

// Chargement du header et du footer
fetch("../templates/header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data)

fetch("../templates/footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data)
