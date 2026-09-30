import { HttpClient} from '@angular/common/http'; //requêtes
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentaireService {
  commentaireURL : string ='/api/commentaires';

  constructor(private httpClient: HttpClient){}

  getCommentairesByRecipe(recipeId: number | string){
    return this.httpClient.get<any[]>(`/api/commentaires/recipe/${recipeId}`);
  }

  createCommentaire(recipeId: string, commentaireObj: any){    
    return this.httpClient.post(`/api/recipes/${recipeId}/commentaires`, commentaireObj);
  }

  deleteCommentaireById(id: string){
    return this.httpClient.delete(this.commentaireURL + "/" + id);
  }

  updateCommentaire(commentaireObj: any, id:number | string){
    return this.httpClient.put(this.commentaireURL + "/" + id, commentaireObj);
  }
}
