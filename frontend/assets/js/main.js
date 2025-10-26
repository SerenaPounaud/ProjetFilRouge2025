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
function fetchRecipesByCategory(category) { //Créer une fonction ftch....category correspond au nom de la categorie à récupérer
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`) //Récupère les recettes des categories
    .then(response => response.json()) 
    .then(data => { //Contient les recettes des catégories
        if (data.meals) { //Verifie si l'API à renvoyé des recettes et si data.meals existe et n'est pas null, si la catégorie n'a pas de recette ou si le mot-clé n'a rien donnée, il sera null
        displayRecipes(data.meals); //Si il existe on appelle display...pour afficher
    }else{ //Si il n'existe pas on affiche une phrase d'erreur
        div_recettes.innerHTML = `<p>Aucune recette trouvée</p>`; //affiche le message d'erreur
    }
    });
}
