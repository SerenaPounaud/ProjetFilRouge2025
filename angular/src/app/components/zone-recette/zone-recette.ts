import { Component, inject } from '@angular/core';
import { ZoneRecetteListeRecettes } from '../zone-recette-liste-recettes/zone-recette-liste-recettes';
import { RecetteService } from '../../services/recette-service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-zone-recette',
  imports: [ZoneRecetteListeRecettes, AsyncPipe],
  templateUrl: './zone-recette.html',
  styleUrl: './zone-recette.css',
})
export class ZoneRecette {
  recipes$!:Observable<any[]>; //récupère immédiatement || + tard

  private RecetteService = inject(RecetteService);
  
  ngOnInit() { //affiche les recettes de la bd
    this.recipes$ = this.RecetteService.getAllRecipes();
  }

}
