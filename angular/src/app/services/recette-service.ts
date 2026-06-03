import { HttpClient} from '@angular/common/http'; //requêtes
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecetteService {
  recetteURL : string='http://localhost:3000/api/recipes'; //port backend node

  constructor(private httpClient: HttpClient){}
  // tab des recettes || []
  getAllRecipes(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.recetteURL);
  }
  // recette || null
  getRecipeById(id:number){
    return this.httpClient.get(this.recetteURL + "/" + id);
  }
  // string || boolean || recipeObj + id
  addRecipe(recipeObj:any){    
    return this.httpClient.post(this.recetteURL, recipeObj);
  }
  // string || boolean
  deleteRecipeById(id:string){
    return this.httpClient.delete(this.recetteURL + "/" + id);
  }
  // string || boolean || recipeObj + id
  updateRecipe(recipeObj:any, id:string){
    return this.httpClient.put(`${this.recetteURL}/${id}`, recipeObj);
  }
}
