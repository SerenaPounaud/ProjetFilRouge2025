import { Component, OnInit,} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilRecettesCard } from '../profil-recettes-card/profil-recettes-card';
import { ProfilRecettesForm } from '../profil-recettes-form/profil-recettes-form';

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

  ngOnInit(): void {
    //récupère les recettes stockées dans le localstorage
    const saved = localStorage.getItem('recettesUsers');
    this.recettesUsers = saved ? JSON.parse(saved) : []; //convertit en tab
  };
  
addRecipe(recipe: any): void { //récupère la recette reçu
  if (recipe.index !== null){
    this.recettesUsers[recipe.index] = recipe.recipe;
  } else {
    this.recettesUsers.push(recipe.recipe);
  }
  localStorage.setItem('recettesUsers', JSON.stringify(this.recettesUsers));
  this.recetteToEdit = null;
  this.editIndex = null;
}
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