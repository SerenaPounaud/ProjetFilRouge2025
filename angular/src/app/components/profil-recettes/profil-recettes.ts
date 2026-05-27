import { Component, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilRecettesCard } from '../profil-recettes-card/profil-recettes-card';
import { ProfilRecettesForm } from '../profil-recettes-form/profil-recettes-form';
import { RecetteService } from '../../services/recette-service';
import { Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-profil-recettes',
  imports: [ReactiveFormsModule, ProfilRecettesCard, ProfilRecettesForm, AsyncPipe, JsonPipe],
  templateUrl: './profil-recettes.html',
  styleUrls: ['./profil-recettes.css']
})
export class ProfilRecettes implements OnInit {
  recetteToEdit: any = null; //index de la recette à éditer, null si création
  recipes$!:Observable<any[]>; //récupère immédiatement les recettes || + tard

  constructor(private rService:RecetteService){} //injecte le crud
  
  ngOnInit(): void { //récupération des recettes
    this.recipes$ = this.rService.getAllRecipes();
  };
  
addRecipe(event: any): void { //récupère l'objet
  const data = event.recipe; //récupère la recette reçu

  if (data?._id){ //si édition
    this.rService.updateRecipe(data, data._id).subscribe(() => {
      this.refresh();
      alert('Recette modifiée');
      this.recetteToEdit = null;
    });
  } else { //si création
    this.rService.addRecipe(data).subscribe({ //écoute + gére la réponse
      next: () => {
        this.refresh();
        alert('Recette ajoutée');
        this.recetteToEdit = null; 
      },
      error: () => {
        alert("Erreur lors de l'ajout de la recette");
      } 
      });
  }
};

removeRecetteUser(id: string): void {
  this.rService.deleteRecipeById(id).subscribe(() => {
    this.refresh();
  });
}

editRecette(recette: any): void {
  this.recetteToEdit = recette; //met la recette dedans
}

private refresh(): void { //recharge toutes les recettes depuis l'api
  this.recipes$ = this.rService.getAllRecipes();
}
}