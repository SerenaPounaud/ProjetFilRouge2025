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

const cache_key = 'allMealsCache'; //stock les recettes
const cache_time_key = 'allMealsCacheTime'; //stock la première heure de stockage ou actualisation
const cache_duree = 24*60*60*1000; //stock 24h en ms

async function fetchAllRecipes(forceRefresh = false) { //force le rafraichissement
    //Vérifie le cache
    const cachedMeals = localStorage.getItem(cache_key);
    const cachedTime = localStorage.getItem(cache_time_key);

    //si on ne force pas l'actualisation mais des données sont en cache (recettes + heure stokage)
    if (!forceRefresh && cachedMeals && cachedTime) { 
        const age = Date.now() - parseInt(cachedTime, 10); //convertit l'heure en nombre et calcul l'age du cache
        if (age < cache_duree) {
            console.log("Recettes encore valide");
            return JSON.parse(cachedMeals); //convertit les recettes en tableau JS utilisable
        } else {
            console.log("Cache expiré");
        }
    }
    //si pas de cache ou refresh forcé
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split(''); //divise en liste de string
    const requests = letters.map(letter => //chaque lettre du tableau => une requête/promesse
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`) //recherche les recettes commençant par cette lettre
        .then(res => res.json())
        .then(data => data.meals || []) //retourne les recettes ou un tableau vide si null/indefined
        .catch(() => []) //en cas d'erreur
    );

    const results = await Promise.all(requests); //attend que toutes les promesses soient terminées
    const merged = results.flat(); //fusionne tous les tableaux de recettes (une lettre = un tableau)

    //Supprime les doublons
    const seen = new Set(); //stocke les idmeal déjà vus
    const uniqueMeals = merged.filter(meal => {
        if (!meal.idMeal || seen.has(meal.idMeal)) return false; //ignore les idmeal manquant ou déjà présent
        seen.add(meal.idMeal); //sinon ajoute l'idmeal dans set
        return true;
    });

    //Stocke dans le cache
    localStorage.setItem(cache_key, JSON.stringify(uniqueMeals)); //convertit en json et stocke dans le navigateur les recettes uniques
    localStorage.setItem(cache_time_key, Date.now().toString()); //convertit en string et stocke l'heure actuelle

    return uniqueMeals; //renvoie le tableau final
}

// Tous les filtres
function applyFilters() {
    filteredMeals = allMeals.filter(meal => {
        //recherche par mot-clé
        if (filters.keyword) {
            //convertit le nom en minuscule pour éviter la casse + vérifie mot clé est présent dans la recette
            if (!meal.strMeal.toLowerCase().includes(filters.keyword)) { 
                return false;
            }
        }
        //recherche par catégorie
        if (filters.category) {
            //exclue les recettes ne correspondant pas à la catégorie sélectionnée
            if (meal.strCategory !== filters.category) { 
                return false;
            }
        }
        //recherche par nb personnes
        if (filters.personnes) {
            const { personnes } = generateFixedInfo(meal.idMeal); //récupère la valeur "personnes" par recette

            if (filters.personnes === 'plus5') {
                if (personnes < 5) return false;
            } else {
                if (personnes !== parseInt(filters.personnes)) return false; //convertit le filtre choisi en nombre puis compare
            }
        }
        return true;
    });
     //recherche par date
        if (filters.dateSort === 'recent') {
            filteredMeals.sort ((a, b) => //a et b représentent deux recettes du tableau
            getDateRecette(b.idMeal) - getDateRecette(a.idMeal) //comparaison : b plus grand(récent) que a
            );
        } else if (filters.dateSort === 'ancien') {
            filteredMeals.sort((a, b) =>
            getDateRecette(a.idMeal) - getDateRecette(b.idMeal)
            );
        }
    currentPage = 1;
    displayRecipesPage(currentPage, filteredMeals);
}

// Récupère les catégories
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
                    categories_ul.appendChild(li); //importe li dans ul
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

// Rechercher des recettes par mot-clé + touche entrée
const formRecherche = document.querySelector('.barre_recherche');
if (formRecherche) {
    formRecherche.addEventListener('submit', (e) => {
    e.preventDefault(); //stop le rechargement  
  filters.keyword = barre_recherche.value.trim().toLowerCase(); //récupère la valeur de la barre de recherche + convertit en miniscule pour éviter sensibilité à la casse
  applyFilters();
});
}

// Evénement filtre par personnes
if (selectPersonnes) {
    selectPersonnes.addEventListener('change', () => {
    filters.personnes = selectPersonnes.value;
    applyFilters();
});
}

// Evénement filtre par date
if (selectDate) {
    selectDate.addEventListener('change', () => {
    filters.dateSort = selectDate.value;
    applyFilters();
})
}

// Bouton reset
if (bouton_reset) {
    bouton_reset.addEventListener('click', () => {
        barre_recherche.value = '';
        selectPersonnes.value = '';
        selectDate.value = '';
        filters.keyword = '';
        filters.category = '';
        filters.personnes = ''; 
        filters.dateSort = '';
        applyFilters();
    });
}

// Bouton actualiser + date dernière mise à jour
const bouton_refresh = document.getElementById('btn_refresh');
const refreshStatus = document.getElementById('refresh_status');

if (bouton_refresh) {
    bouton_refresh.addEventListener('click', async () => {
        if (div_recettes) {
        div_recettes.innerHTML = '<p>Actualisation en cours...</p>';
        }
        if (refreshStatus) {
            refreshStatus.textContent = 'Actualisation en cours...';
        }
        allMeals = await fetchAllRecipes(true); //ignore le localstorage, force le refresh
        filteredMeals = [...allMeals];
        applyFilters(); //réapplique les filtres sélectionnés

        const cachedTime = localStorage.getItem(cache_time_key);
        if (cachedTime) {
            const lastUpdate = new Date(parseInt(cachedTime, 10)).toLocaleDateString('fr-FR', {day: '2-digit', month:'2-digit', year: 'numeric'});
            refreshStatus.textContent = `Dernière mise à jour : ${lastUpdate}`
        }
    toast("Vous êtes à jours !");
    });
}

// Chargement initial/rechargement de la page
document.addEventListener('DOMContentLoaded', async () => { //attend que html soit chargé

    // Afficher la date d'actualisation sans cliquer sur le bouton
    const cachedTime = localStorage.getItem(cache_time_key);
    if (cachedTime && refreshStatus) {
        const lastUpdate = new Date(parseInt(cachedTime, 10)).toLocaleDateString('fr-FR');
        refreshStatus.textContent = `Dernière actualisation : ${lastUpdate}`;
    }

    //réinitialisation des champs
    if (barre_recherche) barre_recherche.value = '';
    if (selectPersonnes) selectPersonnes.value = '';
    if (selectDate) selectDate.value = '';

    //réinitialisation des filtres
    filters.keyword = '';
    filters.category = '';
    filters.personnes = '';
    filters.dateSort = '';
    currentPage = 1;

    if (div_recettes) {
        div_recettes.innerHTML = '<p>Chargement des recettes...</p>';
    }

    allMeals = await fetchAllRecipes(); //charge et stock toutes les recettes sans filtre
    filteredMeals = [...allMeals].sort (() => Math.random() - 0.5); //fonction de comparaison pour forcer un ordre aléatoire
    //créer une copie du tableau des recettes, trie et mélange aléatoirement 

    displayRecipesPage(1, filteredMeals);
});

fetch("templates/footer.html")
    .then(res => res.text())
    .then(data => document.getElementById("footer").innerHTML = data);