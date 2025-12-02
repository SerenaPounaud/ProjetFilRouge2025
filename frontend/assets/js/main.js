const categories_ul = document.getElementById('liste_categories')
const div_recettes = document.getElementById('recettes')
const barre_recherche = document.getElementById('barre_recherche')
const bouton_recherche = document.getElementById('btn_recherche')
const selectFiltre = document.getElementById('btn_filtre');

// Récupérer les catégories de l'API
fetch('https://www.themealdb.com/api/json/v1/1/categories.php') //Requête HTTP pour prendre toutes les catégories
    .then(response => response.json())                         //Renvoie une promesse de l'API, transforme la réponse en objet JS (Json en JS) et de continuer si la promesse est résolue
    .then(data => {                                           //Récupère les données JSON dans la variable data, elle contient une clé categories qui est un tableau de toutes les catgories
         data.categories.forEach(category => {               //Parcourt chaque catégories avec forEach, category représente un objet de catégorie à chaque itération (ex:idCategory: "1", strCategory:"Beef")
            const li = document.createElement('li');        //Créer un élément li
            li.textContent = category.strCategory;         //Remplit le li avec le nom de la catégorie qui vient de l'API
            li.style.cursor = 'pointer';                  //Change le curseur de la souris en main quand on survol
            li.addEventListener('click', () =>           //Ajoute un événement clic sur li
                fetchRecipesByCategory(category.strCategory)); //La fonction fetch...est appelée lorsqu'on clique, récupère et affiche les recettes de la catégorie
            categories_ul.appendChild(li);             //Ajoute li dans la liste ul et l'affiche
        }); 
});

// Répcupérer les recettes par catégorie
function fetchRecipesByCategory(category) {              //Créer une fonction fetch...category correspond au nom de la categorie à récupérer
    div_recettes.innerHTML = `<h2>Recettes : ${category}</h2><p>Chargement...</p>`; //affiche un texte pendant le chargement
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`) //Récupère les recettes des categories
    .then(response => response.json()) 
    .then(data => {                                    //Contient les recettes des catégories
        if (data.meals) {                             //Verifie si l'API à renvoyé des recettes et si data.meals existe et n'est pas null, si la catégorie n'a pas de recette ou si le mot-clé n'a rien donnée, il sera null
        displayRecipes(data.meals);                  //Si il existe on appelle display...pour afficher
    }else{                                          //Si il n'existe pas on affiche une phrase d'erreur
        div_recettes.innerHTML = `<p>Aucune recette trouvée</p>`;    //affiche le message d'erreur
    }
    });
}

// Rechercher des recettes par mot-clé
bouton_recherche.addEventListener('click', () => {      //créer un événement sur le bouton
  const keyword = barre_recherche.value.trim();        //lit la valeur de la barre de recherche, trin = supprime les espace inutiles en début et fin
  if (!keyword) return;                               //si keyword est vide on arrête la fonction

  div_recettes.innerHTML = '<p>Recherche en cours...</p>'; //affiche un message de recherche

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(keyword)}`) //requête http get en injectant la valeur keyword dans url, encodeURIComponent(keyword) = si keyword contient des caractères spéciaux
    .then(response => {
        if (!response.ok) { //si la réponse n'est pas ok, on déclenche une erreur
            throw new Error(`Erreur HTTP : ${response.status}`); //throw = interrompt et lance une erreur, new Error = créer un objet d'erreur
        }
        return response.json(); //convertit en objet js
    })
    .then(data => {
      if (data.meals) {              //si la propriété meals existe ou n'est pas null sinon renvoie null si pas de repas correspondant
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

// Affiche les recettes quand on appuie sur le bouton 'Entrée'
barre_recherche.addEventListener('keydown', (e) => { //l'événement keydown se déclanche quand tu appuies sur une touche, e = event:objet évément qui contient toutes les informations sur la touche pressée, position souris...
    if (e.key === 'Enter') {                        //e.key contient la valeur de la touche entrée
        bouton_recherche.click();
    }
});

// Afficher les recettes
function displayRecipes(meals) { 
    div_recettes.innerHTML = '';                         //réinitialise le contenu html pour afficher les nouveaux résultats
    meals.forEach(meal => {                             //parcourt le tableau meals, pour chaque élément la fonction reçoit l'objet meal correspondant à une recette
        const mealDiv = document.createElement('div'); //crée une div pour afficher les recettes
        mealDiv.classList.add('recette-item');        //crée une classe pour css
        mealDiv.style.cursor='pointer';              //le curseur devient une main au survol

        mealDiv.innerHTML = `
        <h3>${meal.strMeal}</h3> 
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">`;

        mealDiv.addEventListener('click', () => {     //lorsqu'on clique => rediriger vers page recettes_déteils
            window.location.href = `templates/recettes_details.html?id=${meal.idMeal}`;
        });

        div_recettes.appendChild(mealDiv);         //ajoute la div de la recette dans div_recettes
    });
} //crée une div pour la recette, affiche le nom de la recette dans h3, affiche l'image de la recette


// Afficher plusieurs recettes aléatoires au chargement de la page sans doublons
function fetchRandomRecipes(number = 5) {                          //nombre de recettes aléatoires par défaut 5
    div_recettes.innerHTML = '<p>Chargement des recettes...</p>'; //remplace le contenu html lors du chargement
    const promises = [];                                         //crée un tableau vide pour stocker toutes les promesses fetch de la boucle for

    for (let i = 0; i < number; i++) {                         //chaque résultat d'itération sera dans le tableau
        promises.push(
            fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                .then(response => response.json())
                .then(data => data.meals[0])                 //récupère l'entrée du tableau meals, objet qui représente la recette
        );
    }

Promise.allSettled(promises)                                 //recupère le tableau promises peut importe si elles échouent ou non (chaque élément est une recette/meal)
    .then(results => {                                      //récupére le résultat puis crée un tableau
        const meals = results                              //on stock les promesses réussies ici
        .filter(r => r.status === 'fulfilled')            //filter parcourt le tableau results et garde que les prommesses résolue, les autres sont ignorées
        .map(r => r.value);                              //map parcourt le tableau filtré, r.value = valeur renvoyée par la promesse (recette)
                                                        //r = nom qu'on donne à chaque élément du tableau results
        const seen = new Set();                        //set = contient des valeurs uniques
        const uniqueMeals = meals.filter(meal => {    //variable contenant que les recettes uniques via tableau filter, meal = recette du tableau meals
            if (seen.has(meal.idMeal)) {             //verifie si l'idMeal est déjà présent dans set seen avec has
                return false;                       //si oui, exclue du tableau
            }
            seen.add(meal.idMeal);                //si non, on ajoute idMeal dans set seen
            return true;                         //la recette sera gardée
            });
        displayRecipes(uniqueMeals);           //appelle la fonction existante pour afficher les recettes du tableau sans doublons
    })        

    .catch(error => {
        console.error('Erreur lors du chargement des recettes aléatoires :', error);
        div_recettes.innerHTML = '<p>Impossible de charger les recettes. Veuillez réessayer plus tard.</p>';
    });
}

//Appel de la fonction au chargement de la page
fetchRandomRecipes(8); //8 recettes aléatoires

/*Le Set n’est pas directement stocké dans uniqueMeals.
Il sert seulement de mémoire temporaire pour savoir quelles recettes ont déjà été vues.
Le tableau uniqueMeals est le résultat filtré, qui ne contient que les recettes dont l’ID n’était pas déjà dans seen.
seen = carnet où tu coches chaque recette (vérifie)*/

// Bouton filtrer par
selectFiltre.addEventListener('change', () => {                            //se déclenche quand l'utilisateur change la valeur 
    const value = selectFiltre.value;                                     //on assigne la valeur de select > option
    const text = selectFiltre.options[selectFiltre.selectedIndex].text;  //collecte toutes les options de select, donne l'index de l'option sélectionnée et récupère le text affiché
    alert('Fonctionnalité à venir');

});

// Charger le header + footer dans index
  fetch("templates/header.html")
      .then(res => res.text())
      .then(data => document.getElementById("header").innerHTML = data);

    fetch("templates/footer.html")
      .then(res => res.text())
      .then(data => document.getElementById("footer").innerHTML = data);


