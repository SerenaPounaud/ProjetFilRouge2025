import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterHome } from './footer-home';

describe('FooterHome', () => {
  let component: FooterHome;
  let fixture: ComponentFixture<FooterHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
