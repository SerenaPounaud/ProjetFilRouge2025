import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetteDetails } from './recette-details';

describe('RecetteDetails', () => {
  let component: RecetteDetails;
  let fixture: ComponentFixture<RecetteDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetteDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetteDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
