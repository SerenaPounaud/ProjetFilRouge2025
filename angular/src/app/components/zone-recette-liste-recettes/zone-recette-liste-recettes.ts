import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-zone-recette-liste-recettes',
  imports: [],
  templateUrl: './zone-recette-liste-recettes.html',
  styleUrl: './zone-recette-liste-recettes.css',
})
export class ZoneRecetteListeRecettes {
@Input() recipe!: any;
}
