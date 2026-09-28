import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commentaire } from './commentaire';

describe('Commentaire', () => {
  let component: Commentaire;
  let fixture: ComponentFixture<Commentaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commentaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commentaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
