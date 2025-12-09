
// Afficher les recettes
function displayRecipes(meals) {
    div_recettes.innerHTML = ''; //réinitialise
    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('recette-item');

        mealDiv.innerHTML = `
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">`;

    mealDiv.addEventListener('click', () => {
        window.location.href = `../templates/recettes_details.html?id=${meal.idMeal}`;
        });
    div_recettes.appendChild(mealDiv);
    });
}

// Récupérer des recettes aléatoires
function fetchRandomRecipesRecherche(nb = 12) {
    div_recettes.innerHTML = '<p>Chargement des recettes...</p>';
    const requests = [];

    for (let i = 0; i < nb; i++) {
        requests.push(
            fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(res => res.json())
            .then(data => data.meals[0])
            .catch(() => null) //ignore les fetch échoués
        );
    }

    Promise.allSettled(requests)
        .then(results => {
            const meals = results
            .filter(r => r.status === 'fulfilled'&& r.value != null)
            .map(r => r.value);

            const vue = new Set();
            const uniqueMeals = meals.filter(meal => {
                if (vue.has(meal.idMeal)) return false;
                vue.add(meal.idMeal);
                return true;
            });
            if (uniqueMeals.length === 0) {
                div_recettes.innerHTML = '<p>Aucune recette trouvée.</p>';
            } else {
            displayRecipes(uniqueMeals);
            }
        })
        .catch(() => {
            div_recettes.innerHTML = '<p>Impossible de charger les recettes. Réessayez plus tard.</p>';
        });
}

    fetchRandomRecipesRecherche(12);





fetch("header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data)
  .catch(() => console.error("Erreur chargement header"));

fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data)
  .catch(() => console.error("Erreur chargement footer"));