import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRecetteRecherche } from './zone-recette-recherche';

describe('ZoneRecetteRecherche', () => {
  let component: ZoneRecetteRecherche;
  let fixture: ComponentFixture<ZoneRecetteRecherche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneRecetteRecherche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRecetteRecherche);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
