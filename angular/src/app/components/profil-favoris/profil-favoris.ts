import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profil-favoris',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './profil-favoris.html',
  styleUrl: './profil-favoris.css',
})
export class ProfilFavoris {
recettesFavoris: any = [
  {id:1, nomRecette: 'Recette 1', img: 'assets/img/cake.webp'},
  {id:2, nomRecette: 'Recette 2', img: 'assets/img/cake.webp'},
  {id:3, nomRecette: 'Recette 3', img: 'assets/img/cake.webp'},
  {id:4, nomRecette: 'Recette 4', img: 'assets/img/cake.webp'},
  {id:5, nomRecette: 'Recette 5', img: 'assets/img/cake.webp'},
  {id:6, nomRecette: 'Recette 6', img: 'assets/img/cake.webp'},
  {id:7, nomRecette: 'Recette 7', img: 'assets/img/cake.webp'},
  {id:8, nomRecette: 'Recette 8', img: 'assets/img/cake.webp'},
  {id:9, nomRecette: 'Recette 9', img: 'assets/img/cake.webp'},
  {id:10, nomRecette: 'Recette 10', img: 'assets/img/cake.webp'}
];
}
