import { Component, inject } from '@angular/core';
import { RecetteService } from '../../services/recette-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Commentaire } from '../commentaire/commentaire';

@Component({
  selector: 'app-recette-details',
  imports: [CommonModule, RouterLink, TitleCasePipe, DatePipe, Commentaire],
  templateUrl: './recette-details.html',
  styleUrl: './recette-details.css',
})
export class RecetteDetails {
  recipe:any;
  isConnected = false;

  constructor(private activatedRoute : ActivatedRoute, private authService: AuthService){}
  private recetteService = inject(RecetteService);
  
  ngOnInit(){
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    this.recetteService.getRecipeById(id).subscribe((recette:any) => {
      this.recipe = recette;

    this.authService.isConnected$.subscribe(status => {
      this.isConnected = status;
    });
    });
  }

}
