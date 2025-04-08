import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisBoxComponent } from './regis-box.component';

describe('RegisBoxComponent', () => {
  let component: RegisBoxComponent;
  let fixture: ComponentFixture<RegisBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
