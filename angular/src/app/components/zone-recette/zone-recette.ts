import { Component, inject } from '@angular/core';
import { ZoneRecetteListeRecettes } from '../zone-recette-liste-recettes/zone-recette-liste-recettes';
import { ZoneRecetteCategories} from '../zone-recette-categories/zone-recette-categories';
import { RecetteService } from '../../services/recette-service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-zone-recette',
  imports: [ZoneRecetteListeRecettes, AsyncPipe, ZoneRecetteCategories],
  templateUrl: './zone-recette.html',
  styleUrl: './zone-recette.css',
})
export class ZoneRecette {
  recipes$!:Observable<any[]>; //récupère immédiatement || + tard

  private RecetteService = inject(RecetteService);
  
  ngOnInit() { //affiche les recettes de la bd
    this.recipes$ = this.RecetteService.getAllRecipes();
  }

filterByCategory(category: string): void {
  this.recipes$ = this.RecetteService.getAllRecipes().pipe(
    map(recipes =>
      recipes.filter(recipe =>
        recipe.categorie === category
      )
    )
  );
}
}
