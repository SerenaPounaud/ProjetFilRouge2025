import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRecette } from './zone-recette';

describe('ZoneRecette', () => {
  let component: ZoneRecette;
  let fixture: ComponentFixture<ZoneRecette>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneRecette]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRecette);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
