const categories_ul = document.getElementById('liste_categories')
const div_recettes = document.getElementById('recettes')
const barre_recherche = document.getElementById('barre_recherche')
const bouton_recherche = document.getElementById('btn_recherche')
const selectPersonnes = document.getElementById('btn_personnes');
const selectDate = document.getElementById('btn_date')
const paginationDiv = document.getElementById('pagination');
const bouton_reset = document.getElementById('btn_reset');

let filteredMeals = []; //recettes après filtre
let currentPage = 1;
let allMeals = []; //toutes les recettes de l'api

const recette_par_page = 12;

// Etat des filtres
const filters = {
    keyword: '',
    category: '',
    personnes: '',
    dateSort: ''
};

// Récupére les recettes de A -> Z
async function fetchAllRecipes() {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split(''); //divise en liste
    const requests = letters.map(letter => //chaque lettre du tableau => une requête/promesse
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`) //recherche les recettes commençant par cette lettre
            .then(res => res.json())
            .then (data => data.meals || []) //retourne les recettes ou un tableau vide si null/indefined
            .catch(() => []) //en cas d'erreur
    );
        const results = await Promise.all(requests); //attend que toutes les promesses soient terminées
        const merged = results.flat(); //fusionne tous les tableaux de recettes (une lettre = un tableau)

        const seen = new Set(); //supprime les doublons
        return merged.filter(meal => {
            if (!meal.idMeal || seen.has(meal.idMeal)) return false; //ignore les doublons ou recettes invalides
            seen.add(meal.idMeal); //ajoute l'id
            return true;
    });
}

// Tous les filtres
function applyFilters() {
    filteredMeals = allMeals.filter(meal => {
        //recherche par mot-clé
        if (filters.keyword) {
            if (!meal.strMeal.toLowerCase().includes(filters.keyword)) {
                return false;
            }
        }
        //recherche par catégorie
        if (filters.category) {
            if (meal.strCategory !== filters.category) {
                return false;
            }
        }
        //recherche par nb personnes
        if (filters.personnes) {
            const { personnes } = generateFixedInfo(meal.idMeal);

            if (filters.personnes === 'plus5') {
                if (personnes < 5) return false;
            } else {
                if (personnes !== parseInt(filters.personnes)) return false;
            }
        }
        return true;
    });
     //recherche par date
        if (filters.dateSort) { //vérifie si l'utilisateur a choisi le trie par date
            filteredMeals.sort((a, b ) => { //trie le tableau, a + b = deux recettes à comparer
                const dateA = getDateRecette(a.idMeal); //calcule la date fixe pour chaque recette
                const dateB = getDateRecette(b.idMeal);

                if (filters.dateSort === 'recent') {
                    return dateB - dateA; //les plus récentes en premier
                } else {
                    return dateA - dateB; //les plus anciennes en premier
                }
            });
        }
    currentPage = 1;
    displayRecipesPage(currentPage, filteredMeals);
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
                    filters.category = cat.strCategory
                        applyFilters();
                };
                    categories_ul.appendChild(li);
            });
        });
}

// Afficher recettes avec pagination
function displayRecipesPage(page, meals) { //affiche une page spécifique + tableau des recettes
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
  filters.keyword = barre_recherche.value.trim().toLowerCase(); //récupère la valeur de la barre de recherche + convertit en miniscule pour éviter sensibilité à la casse
  applyFilters();
});

// Entrée = déclenche recherche
barre_recherche.addEventListener('keydown', (e) => { //keydown se déclenche dès qu'on appuie sur une touche, e = event:objet élément qui contient toutes les informations sur la touche pressée
    if (e.key === 'Enter') { //vérifie si la touche pressée est entrée
        bouton_recherche.click();
    }
});

// Evénement filtre par personnes
selectPersonnes.addEventListener('change', () => {
    filters.personnes = selectPersonnes.value;
    applyFilters();
});

// Evénement filtre par date
selectDate.addEventListener('change', () => {
    filters.dateSort = selectDate.value;
    applyFilters();
})

// Bouton reset
if (bouton_reset) {
    bouton_reset.addEventListener('click', () => {
        barre_recherche.value = '';
        selectPersonnes.value = '';
        selectDate.value = '';
        filters.keyword = '';
        filters.category = '';
        filters.personnes = ''; 
        applyFilters();
    });
}

// Chargement initial
document.addEventListener('DOMContentLoaded', async () => { //attend que html soit chargé
    div_recettes.innerHTML = '<p>Chargement des recettes...</p>';

    allMeals = await fetchAllRecipes(); //charge et stock toutes les recettes sans filtre
    filteredMeals = [...allMeals].sort (() => Math.random() - 0.5);
    //créer une copie, trie et mélange aléatoirement les recettes 

    displayRecipesPage(1, filteredMeals);
});

// Charger le header + footer dans index
  fetch("templates/header.html")
      .then(res => res.text())
      .then(data => document.getElementById("header").innerHTML = data);

    fetch("templates/footer.html")
      .then(res => res.text())
      .then(data => document.getElementById("footer").innerHTML = data);