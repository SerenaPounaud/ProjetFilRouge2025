import axios from 'axios'; //permet requête http

const mealsURL = 'https://www.themealdb.com/api/json/v1/1';

// récupère toutes les recettes de l'api
export async function getAllMeals() {
    const allMeals = [];

    // récupère toutes les recettes lettre par lettre
    for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
        const response = await axios.get(
            `${mealsURL}/search.php?f=${letter}`
        );

        if (response.data.meals) {
            allMeals.push(...response.data.meals); //push chaque élément un par un au propre
        }
    }
    return allMeals;
}

