const paginationDiv = document.getElementById('pagination');

const recette_par_page = 12;
let allMeals = [];
let currentPage = 1;

// Afficher recettes avec pagination
function displayRecipesPage(page = 1, meals = allMeals) {
    div_recettes.innerHTML = ''; //réinitialise
    currentPage = page;

    const start = (page - 1) * recette_par_page;
    const end = start + recette_par_page;
    const mealsToShow = meals.slice(start, end);
    
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

        const noteBlock = createNoteBlock(meal.idMeal);
        mealDiv.appendChild(noteBlock);

        mealDiv.addEventListener('click', () => {
            window.location.href = `recettes_details.html?id=${meal.idMeal}`;
        });
        div_recettes.appendChild(mealDiv);
    });
    createPaginationButtons(meals);
}

// Boutons pagination
function createPaginationButtons(meals = allMeals) {
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(allMeals.length / recette_par_page);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.toggle('active', i === currentPage);
        btn.addEventListener('click', () => displayRecipesPage(i, meals));
        paginationDiv.appendChild(btn);
    }
}
// Récupérer des recettes alphabet
async function fetchAllRecipes() {
    div_recettes.innerHTML = '<p>Chargement des recettes...</p>';
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const allRequests = letters.map(letter =>
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
            .then(res => res.json())
            .then (data => data.meals || [])
            .catch(() => [])
    );
    try {
        const results = await Promise.all(allRequests);
        const merged = results.flat();

        const seen = new Set();
        allMeals = merged.filter(meal => {
            if (seen.has(meal.idMeal)) return false;
            seen.add(meal.idMeal);
            return true;
        });
        displayRecipesPage(1);
    } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
        div_recettes.innerHTML = '<p>Impossible de charger les recettes. Réessayer plus tard.</p>';
    }
}

// Recherche par mot-clé
document.getElementById('btn_recherche').addEventListener('click', () => {
    const keyword = document.getElementById('barre_recherche').value.trim();
    if (!keyword) return;

    div_recettes.innerHTML = '<p>Recherche en cours...</p>';

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(data => {
            allMeals = data.meals || [];
            displayRecipesPage(1);
        })
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
            .then(data => {
                allMeals = data.meals || [];
                displayRecipesPage(1);
            })
            .catch(() => div_recettes.innerHTML = '<p>Impossible de charger les recettes.</p>');
        
    }
});
fetchAllRecipes();


fetch("../templates/header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data)
  .catch(() => console.error("Erreur chargement header"));

fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data)
  .catch(() => console.error("Erreur chargement footer"));