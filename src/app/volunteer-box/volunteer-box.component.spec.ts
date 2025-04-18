import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerBoxComponent } from './volunteer-box.component';

describe('VolunteerBoxComponent', () => {
  let component: VolunteerBoxComponent;
  let fixture: ComponentFixture<VolunteerBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
