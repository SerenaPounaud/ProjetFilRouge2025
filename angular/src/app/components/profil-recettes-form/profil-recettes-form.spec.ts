import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilRecettesForm } from './profil-recettes-form';

describe('ProfilRecettesForm', () => {
  let component: ProfilRecettesForm;
  let fixture: ComponentFixture<ProfilRecettesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilRecettesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilRecettesForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
