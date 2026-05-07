import { Component } from '@angular/core';
import { ProfilInfos } from '../profil-infos/profil-infos';
import { ProfilFavoris } from '../profil-favoris/profil-favoris';
import { ProfilRecettes } from '../profil-recettes/profil-recettes';

@Component({
  selector: 'app-profil',
  imports: [ProfilInfos, ProfilFavoris, ProfilRecettes],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  sectionActive: string = 'profil'; //par défaut

  //change la section actuellement affichée
  changeSection(section: string): void {
    this.sectionActive = section;
  }
}
