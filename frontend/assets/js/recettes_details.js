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
  getRecipeDetails(idMeal).then(meal => { //appelle la fonction, meal = recevra le résultat
    if (!meal) { //si null ou undefined
      recipeDetailsDiv.innerHTML = '<p>Recette introuvable.</p>';
      return; //quitte la fonction pour éviter que le code continu si meal est absent
    }
  
    const { temps, personnes } = generateFixedInfo(idMeal); //déstructuration = 2 variables
  
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

    // HTML final 
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
}//instructions fournit par l'API

// Chargement du header et du footer
fetch("../templates/header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data)

fetch("../templates/footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data)
