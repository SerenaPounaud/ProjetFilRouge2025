import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilInfos } from './profil-infos';

describe('ProfilInfos', () => {
  let component: ProfilInfos;
  let fixture: ComponentFixture<ProfilInfos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilInfos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilInfos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
