const categories_ul = document.getElementById('liste_categories')
const div_recettes = document.getElementById('recettes')
const barre_recherche = document.getElementById('barre_recherche')
const bouton_recherche = document.getElementById('btn_recherche')
const selectFiltre = document.getElementById('btn_filtre');
const paginationDiv = document.getElementById('pagination');
const bouton_reset = document.getElementById('btn_reset');

let filteredMeals = [];
let AllApiMeals = [];
let currentPage = 1;
let allMeals = [];

const recette_par_page = 12;

// Récupérer des recettes dans alphabet
async function fetchAllRecipes() {
    if (AllApiMeals.length) return AllApiMeals;

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
        AllApiMeals = merged.filter(meal => {
            if (!meal.idMeal || seen.has(meal.idMeal)) return false;
            seen.add(meal.idMeal);
            return true;
        });
        return AllApiMeals;
    } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
        div_recettes.innerHTML = '<p>Impossible de charger les recettes. Réessayer plus tard.</p>';
    }
}

// Récupère les catégories uniquement si l'élément existe
if (categories_ul) {
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(res => res.json())
        .then(data => {
            data.categories.forEach(cat => {
                const li = document.createElement('li');
                li.textContent = cat.strCategory;
                li.style.cursor = 'pointer';
                li.onclick = () => {
                    filteredMeals = allMeals.filter (
                        meal => meal.strCategory === cat.strCategory
                    );
                    displayRecipesPage(1, filteredMeals);
            };
            categories_ul.appendChild(li);
        });
    })
    .catch (err => console.error(err));
}

// Afficher recettes avec pagination
function displayRecipesPage(page = 1, meals = filteredMeals) {
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
        mealDiv.className = 'recette-item';
        mealDiv.style.cursor = 'pointer';
        mealDiv.innerHTML = `
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">`;

        mealDiv.appendChild(createNoteBlock(meal.idMeal));
        mealDiv.onclick = () => 
            window.location.href = `./templates/recettes_details.html?id=${meal.idMeal}`;

        div_recettes.appendChild(mealDiv);
    });
    createPaginationButtons(meals);
}
// Boutons pagination
function createPaginationButtons(meals) {
    if (!paginationDiv) return;
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(meals.length / recette_par_page);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.toggle('active', i === currentPage);
        btn.onclick = () => displayRecipesPage(i, meals);
        paginationDiv.appendChild(btn);
    }
}

// Rechercher des recettes par mot-clé
bouton_recherche.addEventListener('click', () => {  
  const keyword = barre_recherche.value.trim().toLowerCase();  //lit la valeur de la barre de recherche, trin = supprime les espace inutiles en début et fin
  if (!keyword) return; //si keyword est vide on arrête la fonction
  
  filteredMeals = allMeals.filter(meal => 
    meal.strMeal.toLowerCase().includes(keyword)
  );
  displayRecipesPage(1, filteredMeals);
});

// Entrée = déclenche recherche
barre_recherche.addEventListener('keydown', (e) => { //l'événement keydown se déclanche quand tu appuies sur une touche, e = event:objet évément qui contient toutes les informations sur la touche pressée, position souris...
    if (e.key === 'Enter') {                        //e.key contient la valeur de la touche entrée
        bouton_recherche.click();
    }
});

// Trie par nb personnes
function filtreParPersonne(value, sourceMeals) {
    if (!value) return [...sourceMeals];

    return sourceMeals.filter(meal => {
        const { personnes } = generateFixedInfo(meal.idMeal);

    switch(value) {
        case '1':
            return personnes === 1;
        case '2':
            return personnes === 2;
        case '3':
            return personnes === 3;
        case '4':
            return personnes === 4;
        case 'plus5':
            return personnes >= 5;
        case 'recent':
        case 'ancien':
            default:
                return true;
    }
});
}

// Evénement filtre par personnes
selectFiltre.addEventListener('change', () => {
    const value = selectFiltre.value;

    filteredMeals = allMeals.filter(meal => {
        const { personnes } = generateFixedInfo(meal.idMeal);
        if (!value) return true;
        if (value === 'plus5') return personnes >=5;
        return personnes === parseInt(value);
    });
    currentPage = 1;
    displayRecipesPage(currentPage, filteredMeals);
});

// Bouton reset
if (bouton_reset) {
    bouton_reset.addEventListener('click', () => {
        barre_recherche.value = '';
        selectFiltre.value = 'recent';
        filteredMeals = [...allMeals];
        currentPage = 1;

        displayRecipesPage(currentPage, filteredMeals);
    });
}

// Chargement initial
document.addEventListener('DOMContentLoaded', async () => {
    div_recettes.innerHTML = '<p>Chargement des recettes...</p>';

    allMeals = await fetchAllRecipes();
    filteredMeals = [...allMeals].sort (() => Math.random() - 0.5); //mélange aléatoire

    displayRecipesPage(1, filteredMeals);
});

// Charger le header + footer dans index
  fetch("templates/header.html")
      .then(res => res.text())
      .then(data => document.getElementById("header").innerHTML = data);

    fetch("templates/footer.html")
      .then(res => res.text())
      .then(data => document.getElementById("footer").innerHTML = data);


