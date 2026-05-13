import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profil-recettes-card',
  imports: [],
  templateUrl: './profil-recettes-card.html',
  styleUrl: './profil-recettes-card.css',
})
export class ProfilRecettesCard {
  @Input() element:any;
  @Input() index!: number; //position de la recette
  @Output() delete = new EventEmitter<number>(); //event suppression enfant -> parent

  removeRecetteUser(): void { //envoi l'index au parent
    this.delete.emit(this.index);
  }

}
