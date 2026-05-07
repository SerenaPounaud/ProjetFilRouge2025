import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilRecettes } from './profil-recettes';

describe('ProfilRecettes', () => {
  let component: ProfilRecettes;
  let fixture: ComponentFixture<ProfilRecettes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilRecettes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilRecettes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
