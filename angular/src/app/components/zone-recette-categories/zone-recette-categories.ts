import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RecetteService } from '../../services/recette-service';

@Component({
  selector: 'app-zone-recette-categories',
  imports: [],
  templateUrl: './zone-recette-categories.html',
  styleUrl: './zone-recette-categories.css',
})
export class ZoneRecetteCategories {
  categories: string[] = [];
  @Output() categorySelected = new EventEmitter<string>();
  selectedCategory = '';
  
  private recetteService = inject(RecetteService);

  ngOnInit(): void {
    this.recetteService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error("Erreur récupération catégories :", error);
      }
    })
  };

  selectCategory(category : string): void {
    this.selectedCategory = category;
    this.categorySelected.emit(category); //envoie au parent
  }

  resetCategory(): void {
    this.selectedCategory = '';
  }
}
