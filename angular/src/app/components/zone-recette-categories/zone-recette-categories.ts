import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RecetteService } from '../../services/recette-service';

@Component({
  selector: 'app-zone-recette-categories',
  imports: [],
  templateUrl: './zone-recette-categories.html',
  styleUrl: './zone-recette-categories.css',
})
export class ZoneRecetteCategories {
  categories: any[] = [];
  @Output() categorySelected = new EventEmitter<string>();
  
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
    this.categorySelected.emit(category);
  }
}
