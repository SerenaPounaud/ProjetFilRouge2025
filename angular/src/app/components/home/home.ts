import { Component } from '@angular/core';
import { Banner } from '../banner/banner';
import { FooterHome } from '../footer-home/footer-home';
import { ZoneRecette } from '../zone-recette/zone-recette';

@Component({
  selector: 'app-home',
  imports: [Banner, FooterHome, ZoneRecette],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
