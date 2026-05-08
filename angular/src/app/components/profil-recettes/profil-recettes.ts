import { Component } from '@angular/core';

@Component({
  selector: 'app-profil-recettes',
  imports: [],
  templateUrl: './profil-recettes.html',
  styleUrl: './profil-recettes.css',
})
export class ProfilRecettes {
isDisabled:boolean=true;

recettesUsers: any = [
  {id:1, nomRecette: 'Recette 1', img: 'assets/img/cake.webp'},
  {id:2, nomRecette: 'Recette 2', img: 'assets/img/cake.webp'},
  {id:3, nomRecette: 'Recette 3', img: 'assets/img/cake.webp'},
  {id:4, nomRecette: 'Recette 4', img: 'assets/img/cake.webp'}
];
}
