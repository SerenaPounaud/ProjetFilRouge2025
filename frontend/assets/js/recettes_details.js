// Récupérer l'id depuis l'URL
const params = new URLSearchParams(window.location.search);
const idMeal = params.get('id');

const recipeDetailsDiv = document.getElementById('recettes_details');

if (!idMeal) {
    recipeDetailsDiv.innerHTML = '<p>Aucune recette sélectionnée.</p>';
} else {
    // Fonction pour récupérer la recette via l'API TheMealDB
    async function getRecipeDetails(id) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de la recette:', error);
            return null;
        }
    }

// Générer un temps de cuisson/nombre de personnes aléatoirement
function generateFixedInfo(id) {
    const num = parseInt(id, 10);
    const temps = 10 + (num % 61);
    const personnes = 1 + (num % 4);
    return {temps, personnes};
}

    // Afficher la recette
    getRecipeDetails(idMeal).then(meal => {
        if (!meal) {
            recipeDetailsDiv.innerHTML = '<p>Recette introuvable.</p>';
            return;
        }
        const {temps, personnes} = generateFixedInfo(idMeal);

        recipeDetailsDiv.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="300">
            <p><strong>Temps de cuisson :</strong> ${temps} min</p>
            <p><strong>Pour :</strong> ${personnes} personne(s)</p>
            <h3>Instructions :</h3>
            <p>${meal.strInstructions}</p>
            <h3>Ingrédients :</h3>
            <ul>
                ${Array.from({length: 20}).map((_, i) => {
                    const ingredient = meal[`strIngredient${i+1}`];
                    const measure = meal[`strMeasure${i+1}`];
                    return ingredient ? `<li>${ingredient} - ${measure}</li>` : '';
                }).join('')}
            </ul>
        `;
    });
}

fetch("../templates/header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data);

fetch("../templates/footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);
