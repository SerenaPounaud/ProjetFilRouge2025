import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-zone-recette-liste-recettes',
  imports: [],
  templateUrl: './zone-recette-liste-recettes.html',
  styleUrl: './zone-recette-liste-recettes.css',
})
export class ZoneRecetteListeRecettes {
@Input() recipes!: any;
@Input() index!: number;

constructor(private router:Router, private activatedRoute: ActivatedRoute){}

ngOnInit(){
  this.index = Number(this.activatedRoute.snapshot.paramMap.get('i'));
};

voirRecette(){
  this.router.navigate(['/recette-details', this.recipes._id]);
}
}
