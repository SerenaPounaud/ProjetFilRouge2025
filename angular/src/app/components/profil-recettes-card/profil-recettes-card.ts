import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profil-recettes-card',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './profil-recettes-card.html',
  styleUrl: './profil-recettes-card.css',
})
export class ProfilRecettesCard {
  @Input() recipe!:any;
  @Input() index!: number; //position de la recette

  @Output() deleteRecette = new EventEmitter<string>(); //event suppression enfant -> parent
  @Output() editRecette = new EventEmitter<any>();

  removeRecetteUser(): void { //envoi l'index au parent
    this.deleteRecette.emit(this.recipe._id);
  }
  updateRecetteUser(): void { //envoi l'index au parent
    this.editRecette.emit(this.recipe);
  }

}
