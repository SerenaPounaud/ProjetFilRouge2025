import { Component } from '@angular/core';
import { RecetteService } from '../../services/recette-service';
import { CommentaireService } from '../../services/commentaire-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Commentaire } from '../commentaire/commentaire';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-recette-details',
  imports: [CommonModule, RouterLink, TitleCasePipe, DatePipe, Commentaire, ReactiveFormsModule],
  templateUrl: './recette-details.html',
  styleUrl: './recette-details.css',
})
export class RecetteDetails {
  commentaireForm!: FormGroup;
  recipe:any;
  isConnected = false;
  commentaires:any[] = [];

  constructor(
    private activatedRoute : ActivatedRoute, 
    private authService: AuthService, 
    private recetteService: RecetteService,
    private commentairesService: CommentaireService,
    private fb: FormBuilder){}
  
ngOnInit() {
    this.commentaireForm = this.fb.group({
    contenu: ['', [Validators.required, Validators.maxLength(500)]],
    note: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
  });

  const id = this.activatedRoute.snapshot.paramMap.get('id');
  if (!id) return;

  //récupèration de la recette
  this.recetteService.getRecipeById(id).subscribe((recette: any) => {
    this.recipe = recette;
  });
  //récupèration des commentaires
  this.commentairesService.getCommentairesByRecipe(id).subscribe((commentaires: any[]) => {
    this.commentaires = commentaires;
  });
  //vérification connexion
  this.authService.isConnected$.subscribe(status => {
    this.isConnected = status;
  });
}

ajouterCommentaire(): void{
  if (this.commentaireForm.invalid) {
    this.commentaireForm.markAllAsTouched();
    return;
  }
  const recipeId = this.activatedRoute.snapshot.paramMap.get('id');
  if(!recipeId) {
    console.error('ID recette introuvable');
    return;
  }

  const newCommentaire = {
    contenu: this.commentaireForm.value.contenu,
    note: Number(this.commentaireForm.value.note)
  };
  console.log('Commentaire ajouter', newCommentaire);

  this.commentairesService.createCommentaire(recipeId, newCommentaire).subscribe({
    next: (response: any) => {
      console.log('Commentaire enregistré :', response);
      //affichage du commentaire ajouté
      this.commentaires.unshift(response.commentaire);
      this.commentaireForm.reset();
    }
  })
}

}
