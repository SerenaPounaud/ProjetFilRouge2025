import { Component, inject } from '@angular/core';
import { ZoneRecetteListeRecettes } from '../zone-recette-liste-recettes/zone-recette-liste-recettes';
import { ZoneRecetteCategories} from '../zone-recette-categories/zone-recette-categories';
import { RecetteService } from '../../services/recette-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zone-recette',
  imports: [ZoneRecetteListeRecettes, ZoneRecetteCategories, FormsModule],
  templateUrl: './zone-recette.html',
  styleUrl: './zone-recette.css',
})
export class ZoneRecette {
  recipes: any[] = [];
  page = 1;
  limit = 16
  totalPages = 0;
  category = '';
  nbPersonnes = '';
  dateTri = '';

  errorMessage: string | null = null;
  isLoading = false;

  private RecetteService = inject(RecetteService);
  
  ngOnInit() { //affiche les recettes de la bd
    this.loadRecipes();
  }

  applyFilters(category?: string): void {
    if (category !== undefined) {
      this.category = category;
    }
    this.page = 1; // Réinitialiser la page à 1 lors de l'application des filtres
    this.loadRecipes();
  }

  // Récupère les recettes de la BD
  loadRecipes(): void {
    this.isLoading = true;
    this.errorMessage = null; //efface une éventuelle erreur précédente

    this.RecetteService.getAllRecipes(this.page, this.limit, this.category, this.nbPersonnes, this.dateTri).subscribe({
      next: (res) => {
        // Les recettes reçues
        this.recipes = res.data;
        // Nombre total de pages
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des recettes', err);
        this.recipes = []; //efface les recettes en cas d'erreur
        this.totalPages = 0;
        this.errorMessage = 'Impossible de charger les recettes. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }
  resetFilters(): void {
    this.nbPersonnes = '';
    this.dateTri = '';
    this.page = 1;
    this.category = '';
    this.loadRecipes();
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
