import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilFavoris } from './profil-favoris';

describe('ProfilFavoris', () => {
  let component: ProfilFavoris;
  let fixture: ComponentFixture<ProfilFavoris>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilFavoris]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilFavoris);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
