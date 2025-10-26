const categories_ul = document.getElementById('liste_categories')
const div_recettes = document.getElementById('recettes')
const barre_recherche = document.getElementById('barre_recherche')
const bouton_recherche = document.getElementById('btn_recherche')
const bouton_filtre = document.getElementById('btn_filtre')

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