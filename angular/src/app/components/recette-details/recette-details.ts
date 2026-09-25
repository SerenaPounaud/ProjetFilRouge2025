import { Component, inject } from '@angular/core';
import { RecetteService } from '../../services/recette-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-recette-details',
  imports: [CommonModule, RouterLink, TitleCasePipe, DatePipe],
  templateUrl: './recette-details.html',
  styleUrl: './recette-details.css',
})
export class RecetteDetails {
  recipe:any;

  constructor(private activatedRoute : ActivatedRoute){}
  private recetteService = inject(RecetteService);
  
  ngOnInit(){
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    this.recetteService.getRecipeById(id).subscribe((recette:any) => {
      this.recipe = recette;
    });
  }
}
