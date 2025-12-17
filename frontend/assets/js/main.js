const categories_ul = document.getElementById('liste_categories')
const div_recettes = document.getElementById('recettes')
const barre_recherche = document.getElementById('barre_recherche')
const bouton_recherche = document.getElementById('btn_recherche')
const selectFiltre = document.getElementById('btn_filtre');
const paginationDiv = document.getElementById('pagination');
const bouton_reset = document.getElementById('btn_reset');

let filteredMeals = []; //recettes après filtre
let AllApiMeals = []; //cache pour éviter de rappeler l'api
let currentPage = 1;
let allMeals = []; //toutes les recettes de l'api

const recette_par_page = 12;

// Récupére les recettes de A -> Z
async function fetchAllRecipes() {
    if (AllApiMeals.length) return AllApiMeals; //si elles sont déjà chargées, on les renvoie

    div_recettes.innerHTML = '<p>Chargement des recettes...</p>';
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split(''); //divise en liste
    const allRequests = letters.map(letter => //chaque lettre du tableau => une requête/promesse
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`) //recherche les recettes commençant par cette lettre
            .then(res => res.json())
            .then (data => data.meals || []) //retourne les recettes ou un tableau vide si null/indefined
            .catch(() => []) //en cas d'erreur
    );
    try {
        const results = await Promise.all(allRequests); //attend que toutes les promesses soient terminées
        const merged = results.flat(); //fusionne tous les tableaux de recettes (une lettre = un tableau)

        const seen = new Set(); //supprime les doublons
        AllApiMeals = merged.filter(meal => {
            if (!meal.idMeal || seen.has(meal.idMeal)) return false; //ignore les doublons ou recettes invalides
            seen.add(meal.idMeal); //ajoute l'id
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
                li.textContent = cat.strCategory; //nom de la catégorie
                li.style.cursor = 'pointer';
                li.onclick = () => {
                    filteredMeals = allMeals.filter ( //filtre les recettes par catégorie
                        meal => meal.strCategory === cat.strCategory
                    );
                    displayRecipesPage(1, filteredMeals); //affiche les recettes filtrées pour la catégorie, sur la page 1
            };
            categories_ul.appendChild(li); //ajoute et affiche li dans ul
        });
    })
    .catch (err => console.error(err));
}

// Afficher recettes avec pagination
function displayRecipesPage(page = 1, meals = filteredMeals) { //affiche une page spécifique + tableau des recettes
    div_recettes.innerHTML = ''; //réinitialise l'affichage
    currentPage = page; //met à jour la page courante

    const start = (page - 1) * recette_par_page; //index de la 1er recette à afficher
    const end = start + recette_par_page; //index non inclus de la dernière recette à afficher, la page 2 recommence à la 13éme
    const mealsToShow = meals.slice(start, end); //tableau avec les recettes d'une page
    
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
    createPaginationButtons(meals); //affiche les boutons de page
}

// Boutons pagination
function createPaginationButtons(meals) {
    if (!paginationDiv) return;
    paginationDiv.innerHTML = ''; //vide le conteneur pour éviter des doublons
    const totalPages = Math.ceil(meals.length / recette_par_page); //calcule et arrondi à l'entier supérieur pour connaitre le nombre de boutons

    for (let i = 1; i <= totalPages; i++) { //créer 1 bouton par page
        const btn = document.createElement('button');
        btn.textContent = i; //affiche le numéro sur le bouton
        btn.classList.add('pagination_btn');
        btn.classList.toggle('active', i === currentPage); //class qui met le bouton en surbrillance si il correspond à la page actuel
        btn.onclick = () => displayRecipesPage(i, meals); //affiche recette lié au bouton
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


