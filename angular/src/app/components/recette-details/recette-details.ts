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
  commentaires: any[] = [];
  currentUser: any = null;

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

  this.authService.checkAuth().subscribe({ 
    next: (user) => { 
      this.currentUser = user; 
      this.isConnected = true; 
    }, 
      error: () => { 
        this.currentUser = null; 
        this.isConnected = false; 
      } 
    });
}

ajouterCommentaire(): void{
  if (this.commentaireForm.invalid) {
    this.commentaireForm.markAllAsTouched(); //indique que tous les champs ont été visités
    return;
  }
  const recipeId = this.activatedRoute.snapshot.paramMap.get('id');
  if(!recipeId) return;

  const newCommentaire = {
    contenu: this.commentaireForm.value.contenu,
    note: Number(this.commentaireForm.value.note)
  };

  this.commentairesService.createCommentaire(recipeId, newCommentaire).subscribe({
    next: (response: any) => {
      //affichage du commentaire ajouté
      this.commentaires.unshift(response.commentaire); //ajoute le commentaire au début du tableau
      this.commentaireForm.reset();
    }
  });
}

onCommentaireSupprime(id: string): void {
  this.commentaires = this.commentaires.filter(commentaire => commentaire._id !== id);
}
}
