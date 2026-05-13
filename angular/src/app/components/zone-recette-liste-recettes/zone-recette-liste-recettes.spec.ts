import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRecetteListeRecettes } from './zone-recette-liste-recettes';

describe('ZoneRecetteListeRecettes', () => {
  let component: ZoneRecetteListeRecettes;
  let fixture: ComponentFixture<ZoneRecetteListeRecettes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneRecetteListeRecettes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRecetteListeRecettes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
