import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRecetteCategories } from './zone-recette-categories';

describe('ZoneRecetteCategories', () => {
  let component: ZoneRecetteCategories;
  let fixture: ComponentFixture<ZoneRecetteCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneRecetteCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneRecetteCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
