const categories_ul = document.getElementById('liste_categories')
const div_recettes = document.getElementById('recettes')
const barre_recherche = document.getElementById('barre_recherche')
const bouton_recherche = document.getElementById('btn_recherche')
const selectFiltre = document.getElementById('btn_filtre');
let allMeals = [];
let filteredMeals = [];



// Récupère les catégories uniquement si l'élément existe
if (categories_ul) {
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(res => res.json())
        .then(data => {
            data.categories.forEach(category => {
                const li = document.createElement('li');
                li.textContent = category.strCategory;
                li.style.cursor = 'pointer';
                li.addEventListener('click', () => fetchRecipesByCategory(category.strCategory));
                categories_ul.appendChild(li);
            });
        })
        .catch(err => console.error("Erreur chargement catégories :", err));
    }

// Répcupérer les recettes par catégorie
function fetchRecipesByCategory(category) { //category correspond au nom de la categorie à récupérer
    if (!div_recettes) return;
        fetchAllRecipes().then(all => {
            allMeals = all.filter(meal => meal.strCategory && meal.strCategory === category);
            filteredMeals = [...allMeals];
            appliquerFiltreEtAfficher();
        });
    }

// Rechercher des recettes par mot-clé
bouton_recherche.addEventListener('click', async () => {  //créer un événement sur le bouton
  const keyword = barre_recherche.value.trim();    //lit la valeur de la barre de recherche, trin = supprime les espace inutiles en début et fin
  if (!keyword) return;                           //si keyword est vide on arrête la fonction
  
  const all = await fetchAllRecipes();
  allMeals = all.filter(meal => 
    meal.strMeal.toLowerCase().includes(keyword)
  );

  filteredMeals = [...allMeals];
  appliquerFiltreEtAfficher();
});

// Affiche les recettes quand on appuie sur le bouton 'Entrée'
barre_recherche.addEventListener('keydown', (e) => { //l'événement keydown se déclanche quand tu appuies sur une touche, e = event:objet évément qui contient toutes les informations sur la touche pressée, position souris...
    if (e.key === 'Enter') {                        //e.key contient la valeur de la touche entrée
        bouton_recherche.click();
    }
});

// Trie par nb personnes
function filtreParPersonne(value) {
    if (!value || !allMeals.length) {
        filteredMeals = [...allMeals];
        return;
    }
    filteredMeals = allMeals.filter(meal => {
        const personnes = generateFixedInfo(meal.idMeal).personnes;

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
selectFiltre.addEventListener('change', () => {
    const value = selectFiltre.value;
    if (!allMeals.length) return;

    sessionStorage.setItem('filtrePersonnes', value);
    filtreParPersonne(value);

    displayRecipes(filteredMeals);
});

// Afficher les recettes
function displayRecipes(meals) {
    div_recettes.innerHTML = '';
    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('recette-item');
        mealDiv.style.cursor = 'pointer';
        mealDiv.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">
        `;
        const noteBlock = createNoteBlock(meal.idMeal);
        mealDiv.appendChild(noteBlock);

        mealDiv.addEventListener('click', () => {
            window.location.href = `templates/recettes_details.html?id=${meal.idMeal}`;
        });
        div_recettes.appendChild(mealDiv);
    });
}

// Afficher plusieurs recettes aléatoires au chargement de la page sans doublons
function fetchRandomRecipes(number = 12) {                         //nombre de recettes aléatoires par défaut
    div_recettes.innerHTML = '<p>Chargement des recettes...</p>'; //remplace le contenu html lors du chargement
    const promises = [];                                         //crée un tableau vide pour stocker toutes les promesses fetch de la boucle for

    for (let i = 0; i < number; i++) {                         //chaque résultat d'itération sera dans le tableau
        promises.push(
            fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                .then(response => response.json())
                .then(data => data.meals[0])                //récupère l'entrée du tableau meals, objet qui représente la recette
        );
    }

Promise.allSettled(promises)                               //recupère le tableau promises peut importe si elles échouent ou non (chaque élément est une recette/meal)
    .then(results => {                                    //récupére le résultat puis crée un tableau
        const meals = results                            //on stock les promesses réussies ici
        .filter(r => r.status === 'fulfilled')          //filter parcourt le tableau results et garde que les prommesses résolue, les autres sont ignorées
        .map(r => r.value);                            //map parcourt le tableau filtré, r.value = valeur renvoyée par la promesse (recette)
                                                      //r = nom qu'on donne à chaque élément du tableau results
        const seen = new Set();                      //set = contient des valeurs uniques
        const uniqueMeals = meals.filter(meal => {  //variable contenant que les recettes uniques via tableau filter, meal = recette du tableau meals
            if (seen.has(meal.idMeal)) {           //verifie si l'idMeal est déjà présent dans set seen avec has
                return false;                     //si oui, exclue du tableau
            }
            seen.add(meal.idMeal);              //si non, on ajoute idMeal dans set seen
            return true;                       //la recette sera gardée
            });
        allMeals = uniqueMeals;
        filteredMeals = [...allMeals];

        sessionStorage.setItem('allMeals', JSON.stringify(allMeals));

        const savedFilter = sessionStorage.getItem('filtrePersonnes');
        if (savedFilter) {
            selectFiltre.value = savedFilter;
            filtreParPersonne(savedFilter);
        }
        appliquerFiltreEtAfficher();
    })        

    .catch(error => {
        console.error('Erreur lors du chargement des recettes aléatoires :', error);
        div_recettes.innerHTML = '<p>Impossible de charger les recettes. Veuillez réessayer plus tard.</p>';
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    div_recettes.innerHTML = '<p>Chargement des recettes...</p>';
    try { //récupèrer toutes les recettes valides
        const all = await fetchAllRecipes();
        allMeals = all;
        filteredMeals = [...allMeals];
        displayRecipesPage(1, filteredMeals);
    } catch (error) {
        console.error(error);
        div_recettes.innerHTML = '<p>Impossible de charger les recettes</p>';
    }
    
});

function appliquerFiltreEtAfficher() {
    const savedFilter = sessionStorage.getItem('filtrePersonnes');

    if (savedFilter) {
        selectFiltre.value = savedFilter;
        filtreParPersonne(savedFilter);
        displayRecipes(filteredMeals);
    } else {
        displayRecipes(allMeals);
    }
}

// Charger le header + footer dans index
  fetch("templates/header.html")
      .then(res => res.text())
      .then(data => document.getElementById("header").innerHTML = data);

    fetch("templates/footer.html")
      .then(res => res.text())
      .then(data => document.getElementById("footer").innerHTML = data);


