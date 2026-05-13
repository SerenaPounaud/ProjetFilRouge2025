import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilRecettesCard } from './profil-recettes-card';

describe('ProfilRecettesCard', () => {
  let component: ProfilRecettesCard;
  let fixture: ComponentFixture<ProfilRecettesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilRecettesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilRecettesCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
