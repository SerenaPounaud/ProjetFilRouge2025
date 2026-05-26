import { Component, OnInit,} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilRecettesCard } from '../profil-recettes-card/profil-recettes-card';
import { ProfilRecettesForm } from '../profil-recettes-form/profil-recettes-form';
import { RecetteService } from '../../services/recette-service';

@Component({
  selector: 'app-profil-recettes',
  imports: [ReactiveFormsModule, ProfilRecettesCard, ProfilRecettesForm],
  templateUrl: './profil-recettes.html',
  styleUrls: ['./profil-recettes.css']
})
export class ProfilRecettes implements OnInit {
  recettesUsers: any[] = [];
  recetteToEdit: any = null;
  editIndex: number | null = null;

  constructor(private rService:RecetteService){}

  ngOnInit(): void {
    //récupère les donnèes à partir de httpclient + et déclenche requêtes
    this.rService.getAllRecipes().subscribe(); 
  };
  
addRecipe(recipe: any): void { //récupère la recette reçu
  if (recipe.index !== null){
    this.recettesUsers[recipe.index] = recipe.recipe;
  } else {
    this.rService.addRecipe(recipe.recipe).subscribe({ //écoute + gére la réponse
      next: (res) => {
        console.log(res);
      },
      error:(err) => {
        console.log(err);
        alert("Erreur lors de l'ajout de la recette");
      }
    });
  }
  this.recetteToEdit = null;
  this.editIndex = null;
};

//@Output
removeRecetteUser(i: number): void {
  this.recettesUsers.splice(i, 1);
  localStorage.setItem('recettesUsers', JSON.stringify(this.recettesUsers));
};

editRecette(recette: any, index: number): void {
  this.recetteToEdit = recette;
  this.editIndex = index;
}

}