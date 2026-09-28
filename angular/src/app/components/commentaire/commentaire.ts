import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-commentaire',
  imports: [],
  templateUrl: './commentaire.html',
  styleUrl: './commentaire.css',
})
export class Commentaire {
@Input() commentaire!: Commentaire;
}
