import { Component } from '@angular/core';
import { RecetteService } from '../../services/recette-service';
import { CommentaireService } from '../../services/commentaire-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Commentaire } from '../commentaire/commentaire';

@Component({
  selector: 'app-recette-details',
  imports: [CommonModule, RouterLink, TitleCasePipe, DatePipe, Commentaire],
  templateUrl: './recette-details.html',
  styleUrl: './recette-details.css',
})
export class RecetteDetails {
  recipe:any;
  isConnected = false;
  commentaires:any[] = [];

  constructor(
    private activatedRoute : ActivatedRoute, 
    private authService: AuthService, 
    private recetteService: RecetteService,
    private commentairesService: CommentaireService){}
  
ngOnInit() {
  const id = this.activatedRoute.snapshot.paramMap.get('id');
  if (!id) return;

  this.recetteService.getRecipeById(id).subscribe((recette: any) => {
    this.recipe = recette;
  });

  this.commentairesService.getCommentairesByRecipe(id).subscribe((commentaires: any[]) => {
    this.commentaires = commentaires;
  });

  this.authService.isConnected$.subscribe(status => {
    this.isConnected = status;
  });
}

}
