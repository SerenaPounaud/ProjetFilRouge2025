import { HttpClient} from '@angular/common/http'; //requêtes
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecetteService {
  recetteURL : string ='/api/recipes';

  constructor(private httpClient: HttpClient){}
  // tab des recettes || []
  getAllRecipes(page: number, limit:number, category?: string){ //? = optionnel
    let url = `${this.recetteURL}?page=${page}&limit=${limit}`; //url de l'api
    if (category) {
      url += `&categorie=${encodeURIComponent(category)}`; //encode correctement et l'ajoute à l'url
    }
    return this.httpClient.get<any>(url);
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
  updateRecipe(recipeObj:any, id:number | string){
    return this.httpClient.put(this.recetteURL + "/" + id, recipeObj);
  }
  getMyRecipes() {
    return this.httpClient.get<any[]>(this.recetteURL + "/me");
  }
  //récupération des catégories
  getCategories(): Observable<string[]> { 
    return this.httpClient.get<string[]>(this.recetteURL + '/external/categories');
  }
}
