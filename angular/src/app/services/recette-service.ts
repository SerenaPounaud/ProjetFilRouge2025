import { HttpClient } from '@angular/common/http'; //requêtes
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecetteService {
  recetteURL : string='http://localhost:3000/api/recipes'; //port backend node

  constructor(private htppClient: HttpClient){}
  // tab des recettes || []
  getAllRecipes(){
    return this.htppClient.get(this.recetteURL);
  }
  // recette || null
  getRecipeById(id:number){
    return this.htppClient.get(this.recetteURL + "/" + id);
  }
  // string || boolean || recipeObj + id
  addRecipe(recipeObj:any){
    return this.htppClient.post(this.recetteURL, recipeObj);
  }
  // string || boolean
  deleteRecipeById(id:number){
    return this.htppClient.delete(this.recetteURL + "/" + id);
  }
  // string || boolean || recipeObj + id
  updateRecipe(recipeObj:any){
    return this.htppClient.put(this.recetteURL, recipeObj);
  }
}
