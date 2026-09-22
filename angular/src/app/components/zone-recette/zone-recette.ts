import { Component, inject } from '@angular/core';
import { ZoneRecetteListeRecettes } from '../zone-recette-liste-recettes/zone-recette-liste-recettes';
import { ZoneRecetteCategories} from '../zone-recette-categories/zone-recette-categories';
import { RecetteService } from '../../services/recette-service';

@Component({
  selector: 'app-zone-recette',
  imports: [ZoneRecetteListeRecettes, ZoneRecetteCategories],
  templateUrl: './zone-recette.html',
  styleUrl: './zone-recette.css',
})
export class ZoneRecette {
  recipes: any[] = [];
  page = 1;
  limit = 16
  totalPages = 0;
  category = '';

  private RecetteService = inject(RecetteService);
  
  ngOnInit() { //affiche les recettes de la bd
    this.loadRecipes();
  }

filterByCategory(category: string): void {
  this.category = category;
  this.page = 1;
  this.loadRecipes();
}

  // Récupère les recettes de la BD
  loadRecipes(): void {
    this.RecetteService.getAllRecipes(this.page, this.limit, this.category)
      .subscribe(res => {
        // Les recettes reçues
        this.recipes = res.data;
        // Nombre total de pages
        this.totalPages = res.totalPages;
      });
  }

  //pagination
  nextPage(){
    if (this.page < this.totalPages){
      this.page++;
      this.loadRecipes();
    }
  }
  previousPage(){
    if (this.page > 1) {
      this.page--;
      this.loadRecipes();
    }
  }
}
