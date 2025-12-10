const paginationDiv = document.getElementById('pagination');

const recette_par_page = 12;
let allMeals = [];
let currentPage = 1;

// Afficher recettes avec pagination
function displayRecipes(meals) {
    allMeals = meals;
    displayRecipesPage(1);
}

function displayRecipesPage(page = 1) {
    div_recettes.innerHTML = ''; //réinitialise
    currentPage = page;

    const start = (page - 1) * recette_par_page;
    const end = start + recette_par_page;
    const mealsToShow = allMeals.slice(start, end);
    
    if (mealsToShow.length === 0) {
        div_recettes.innerHTML = '<p>Aucune recette trouvée</p>';
        paginationDiv.innerHTML = '';
        return;
    }
    mealsToShow.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('recette-item');
        mealDiv.style.cursor = 'pointer';
        mealDiv.innerHTML = `
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">`;

        mealDiv.addEventListener('click', () => {
            window.location.href = `recettes_details.html?id=${meal.idMeal}`;
        });
        div_recettes.appendChild(mealDiv);
    });
    createPaginationButtons();
}

// Boutons pagination
function createPaginationButtons() {
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(allMeals.length / recette_par_page);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.toggle('active', i === currentPage);
        btn.addEventListener('click', () => displayRecipesPage(i));
        paginationDiv.appendChild(btn);
    }
}
// Récupérer des recettes aléatoires
function fetchRandomRecipes(nb = 12) {
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
            displayRecipes(uniqueMeals);
        })
        .catch(() => {
            div_recettes.innerHTML = '<p>Impossible de charger les recettes. Réessayez plus tard.</p>';
        });
}
fetchRandomRecipes();

// Recherche par mot-clé
document.getElementById('btn_recherche').addEventListener('click', () => {
    const keyword = document.getElementById('barre_recherche').value.trim();
    if (!keyword) return;

    div_recettes.innerHTML = '<p>Recherche en cours...</p>';

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(data => 
            displayRecipes(data.meals || []))
        .catch(() => {
            div_recettes.innerHTML = '<p>Une erreur est survenue. Veuillez réessayer plus tard.</p>';
        });
});

// Entrée = déclenche recherche
document.getElementById('barre_recherche').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btn_recherche').click();
});

// Récupérer par catégorie
document.addEventListener("click", (e) => {
    if (e.target.matches("li")) {
        const category = e.target.textContent.trim();
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then(res => res.json())
            .then(data => displayRecipes(data.meals || []))
            .catch(() => div_recettes.innerHTML = '<p>Impossible de charger les recettes.</p>');
        
    }
});


fetch("../templates/header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data)
  .catch(() => console.error("Erreur chargement header"));

fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data)
  .catch(() => console.error("Erreur chargement footer"));