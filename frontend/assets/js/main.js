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
    if (!div_recettes) return; //si la page n'a pas de conteneur
    
    div_recettes.innerHTML = `<h2>Recettes : ${category}</h2><p>Chargement...</p>`; //affiche un texte pendant le chargement
    
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`) //Récupère les recettes des categories
    .then(response => response.json()) 
    .then(data => {        //Contient les recettes des catégories
        if (!data.meals) { 
            div_recettes.innerHTML = '<p>Aucune recette trouvée.</p>';
            return;
        }
            
            allMeals = data.meals;
            filteredMeals = [...allMeals];

            sessionStorage.setItem('allMeals', JSON.stringify(allMeals));
            sessionStorage.setItem('source', 'category');
            sessionStorage.removeItem('filtrePersonnes');

        displayRecipes(filteredMeals);    //Si il existe on appelle display...pour afficher
    })
    .catch(err => {
        console.error("Erreur récupération recettes :", err);
        div_recettes.innerHTML = `Impossible de charger les recettes. Réessayer plus tard`;
    });
}

// Rechercher des recettes par mot-clé
bouton_recherche.addEventListener('click', () => {  //créer un événement sur le bouton
  const keyword = barre_recherche.value.trim();    //lit la valeur de la barre de recherche, trin = supprime les espace inutiles en début et fin
  if (!keyword) return;                           //si keyword est vide on arrête la fonction

  div_recettes.innerHTML = '<p>Recherche en cours...</p>'; //affiche un message de recherche

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(keyword)}`) //requête http get en injectant la valeur keyword dans url, encodeURIComponent(keyword) = si keyword contient des caractères spéciaux
    .then(response => {
        if (!response.ok) { //si la réponse n'est pas ok, on déclenche une erreur
            throw new Error(`Erreur HTTP : ${response.status}`); //throw = interrompt et lance une erreur, new Error = créer un objet d'erreur
        }
        return response.json(); //convertit en objet js
    })
    .then(data => {
      if (data.meals) {    
            allMeals = data.meals || [];
            filteredMeals = [...allMeals];

            sessionStorage.setItem('allMeals', JSON.stringify(allMeals));
            sessionStorage.setItem('source', 'search');
            sessionStorage.removeItem('filtrePersonnes');

            const savedFilter = sessionStorage.getItem('filrePersonnes');
            if (savedFilter) {
                selectFiltre.value = savedFilter;
                filtreParPersonne(savedFilter);
            }

        displayRecipes(filteredMeals); //si oui alors affiche les recettes
      } else {
        div_recettes.innerHTML = '<p>Aucune recette trouvée</p>'; //si pas de recettes alors on affiche un message dans le conteneur
      }
    })
    .catch(error => { //intercepte/traite les erreurs
        console.error('Erreur lors de la recherche :', error); //affiche l'erreur complète
        div_recettes.innerHTML = '<p>Une erreur est survenue. Veuillez réessayer plus tard.</p>'; //affiche un message à l'utilisateur
    });
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
    filteredMeals = [...allMeals];

    switch(value) {
        case '1':
            filteredMeals = filteredMeals.filter(meal => generateFixedInfo(meal.idMeal).personnes === 1);
            break;
            case '2':
            filteredMeals = filteredMeals.filter(meal => generateFixedInfo(meal.idMeal).personnes === 2);
            break;
            case '3':
            filteredMeals = filteredMeals.filter(meal => generateFixedInfo(meal.idMeal).personnes === 3);
            break;
            case '4':
            filteredMeals = filteredMeals.filter(meal => generateFixedInfo(meal.idMeal).personnes === 4);
            break;
            case 'plus5':
            filteredMeals = filteredMeals.filter(meal => generateFixedInfo(meal.idMeal).personnes >= 5);
            break;
            case 'recent':
            case 'ancien':
                default:
                    filteredMeals = [...allMeals];
    }
}
selectFiltre.addEventListener('change', () => {
    const value = selectFiltre.value;
    if (!allMeals.length) return;

    sessionStorage.setItem('filtrePersonnes', value);
    filtreParPersonne(value);

    if (typeof displayRecipes === 'function') {
        displayRecipesPage(1, filteredMeals);
    } else if(typeof displayRecipes === 'function'){
        displayRecipes(filteredMeals);
    }
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
                .then(data => data.meals[0])                 //récupère l'entrée du tableau meals, objet qui représente la recette
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

        const savedFilter = sessionStorage.getItem('filtrePersones');
        if (savedFilter) {
            selectFiltre.value = savedFilter;
            filtreParPersonne(savedFilter);
        }
        displayRecipes(uniqueMeals);       //appelle la fonction existante pour afficher les recettes du tableau sans doublons
    })        

    .catch(error => {
        console.error('Erreur lors du chargement des recettes aléatoires :', error);
        div_recettes.innerHTML = '<p>Impossible de charger les recettes. Veuillez réessayer plus tard.</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedMeals = sessionStorage.getItem('allMeals');
    const savedFilter = sessionStorage.getItem('filtrePersonnes');

    if (savedMeals) {
        allMeals = JSON.parse(savedMeals);
        filteredMeals = [...allMeals];

        if (savedFilter) {
            selectFiltre.value = savedFilter;
            filtreParPersonne(savedFilter);
        }
        displayRecipes(filteredMeals);
    } else {
        fetchRandomRecipes(12);
    }
});

// Charger le header + footer dans index
  fetch("templates/header.html")
      .then(res => res.text())
      .then(data => document.getElementById("header").innerHTML = data);

    fetch("templates/footer.html")
      .then(res => res.text())
      .then(data => document.getElementById("footer").innerHTML = data);


