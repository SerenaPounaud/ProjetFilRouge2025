const categories_ul = document.getElementById('liste_categories')
const div_recettes = document.getElementById('recettes')
const barre_recherche = document.getElementById('barre_recherche')
const bouton_recherche = document.getElementById('btn_recherche')
const bouton_filtre = document.getElementById('btn_filtre')

//Récupérer les catégories de l'API
fetch('https://www.themealdb.com/api/json/v1/1/categories.php') //Requête HTTP pour prendre toutes les catégories
    .then(response => response.json()) //Renvoie une promesse de l'API, transforme la réponse en objet JS (Json en JS) et de continuer si la promesse est résolue
    .then(data => //Récupère les données JSON dans la variable data, elle contient une clé categories qui est un tableau de toutes les catgories
        { data.categories.forEach(category => { //Parcourt chaque catégories avec forEach, category représente un objet de catégorie à chaque itération (ex:idCategory: "1", strCategory:"Beef")
            const li = document.createElement('li'); //Créer un élément li
            li.textContent = category.strCategory; //Remplit le li avec le nom de la catégorie qui vient de l'API
            li.style.cursor = 'pointer'; //Change le curseur de la souris en main quand on survol
            li.addEventListener('click', () => //Ajoute un événement clic sur li
                fetchRecipesByCategory(category.strCategory)); //La fonction fetch...est appelée lorsqu'on clique, récupère et affiche les recettes de la catégorie
            categories_ul.appendChild(li); //Ajoute li dans la liste ul et l'affiche
        }); 
});

//Répcupérer les recettes par catégorie
function fetchRecipesByCategory(category) {     //Créer une fonction ftch....category correspond au nom de la categorie à récupérer
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`) //Récupère les recettes des categories
    .then(response => response.json()) 
    .then(data => {      //Contient les recettes des catégories
        if (data.meals) {      //Verifie si l'API à renvoyé des recettes et si data.meals existe et n'est pas null, si la catégorie n'a pas de recette ou si le mot-clé n'a rien donnée, il sera null
        displayRecipes(data.meals);     //Si il existe on appelle display...pour afficher
    }else{      //Si il n'existe pas on affiche une phrase d'erreur
        div_recettes.innerHTML = `<p>Aucune recette trouvée</p>`;    //affiche le message d'erreur
    }
    });
}

//Rechercher des recettes par mot-clé
bouton_recherche.addEventListener('click', () => { //créer un événement sur le bouton
  const keyword = barre_recherche.value.trim(); //lit la valeur de la barre de recherche, trin = supprime les espace inutiles en début et fin
  if (!keyword) return; //si keyword est vide on arrête la fonction

  div_recettes.innerHTML = '<p>Recherche en cours...</p>'; //affiche un message de recherche

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(keyword)}`) //requête http get en injectant la valeur keyword dans url, encodeURIComponent(keyword) = si keyword contient des caractères spéciaux
    .then(response => {
        if (!response.ok) { //si la réponse n'est pas ok, on déclenche une erreur
            throw new Error(`Erreur HTTP : ${response.status}`); //throw = interrompt et lance une erreur, new Error = créer un objet d'erreur
        }
        return response.json(); //convertit en objet js
    })
    .then(data => {
      if (data.meals) { //si la propriété meals existe ou n'est pas null sinon renvoie null si pas de repas correspondant
        displayRecipes(data.meals); //si oui alors affiche les recettes
      } else {
        div_recettes.innerHTML = '<p>Aucune recette trouvée</p>'; //si pas de recettes alors on affiche un message dans le conteneur
      }
    })
    .catch(error => { //intercepte/traite les erreurs
        console.error('Erreur lors de la recherche :', error); //affiche l'erreur complète
        div_recettes.innerHTML = '<p>Une erreur est survenue. Veuillez réessayer plus tard.</p>'; //affiche un message à l'utilisateur
    });
});

//Affiche les recettes quand on appuie sur le bouton 'Entrée'
barre_recherche.addEventListener('keydown', (e) => { //l'événement keydown se déclanche quand tu appuies sur une touche, e = event:objet évément qui contient toutes les informations sur la touche pressée, position souris...
    if (e.key === 'Enter') { //e.key contient la valeur de la touche entrée
        bouton_recherche.click();
    }
});


//Afficher les recettes
function displayRecipes(meals) { 
    div_recettes.innerHTML = ''; //réinitialise le contenu html pour afficher les nouveaux résultats
    meals.forEach(meal => { //parcourt le tableau meals, pour chaque élément la fonction reçoit l'objet meal correspondant à une recette
        const mealDiv = document.createElement('div'); //crée une div pour afficher les recettes
        mealDiv.innerHTML = `
        <h3>${meal.strMeal}</h3> 
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">`;
        div_recettes.appendChild(mealDiv); //ajoute la div de la recette dans div_recettes
    });
} //crée une div pour la recette, affiche le nom de la recette dans h3, affiche l'image de la recette


// Afficher plusieurs recettes aléatoires au chargement de la page
function fetchRandomRecipes(number = 5) { //number = nombre de recettes aléatoires à afficher
    div_recettes.innerHTML = '<p>Chargement des recettes aléatoires...</p>';
    const promises = [];

    for (let i = 0; i < number; i++) {
        promises.push(
            fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                .then(response => response.json())
                .then(data => data.meals[0])
        );
    }

    Promise.all(promises)
        .then(meals => {
            displayRecipes(meals); //utilise ta fonction existante pour afficher
        })
        .catch(error => {
            console.error('Erreur lors du chargement des recettes aléatoires :', error);
            div_recettes.innerHTML = '<p>Impossible de charger les recettes. Veuillez réessayer plus tard.</p>';
        });
}

//Appel de la fonction au chargement de la page
fetchRandomRecipes(6); //6 recettes aléatoires
 