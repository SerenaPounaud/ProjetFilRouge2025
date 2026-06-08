import { TestBed } from '@angular/core/testing';

import { MealdbServiceTs } from './mealdb-service.ts';

describe('MealdbServiceTs', () => {
  let service: MealdbServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealdbServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
