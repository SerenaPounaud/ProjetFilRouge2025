import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-commentaire',
  imports: [DatePipe],
  templateUrl: './commentaire.html',
  styleUrl: './commentaire.css',
})
export class Commentaire {
@Input() commentaire!: any;
}
