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

  ngOnInit(): void {
    //récupère les recettes stockées dans le localstorage
    const saved = localStorage.getItem('recettesUsers');
    this.recettesUsers = saved ? JSON.parse(saved) : []; //convertit en tab
  };
  
addRecipe(recipe: any): void { //récupère la recette reçu
  this.recettesUsers.push(recipe);
  localStorage.setItem('recettesUsers', JSON.stringify(this.recettesUsers));
}
removeRecetteUser(i: number): void {
  this.recettesUsers.splice(i, 1);
  localStorage.setItem('recettesUsers', JSON.stringify(this.recettesUsers));
};


}