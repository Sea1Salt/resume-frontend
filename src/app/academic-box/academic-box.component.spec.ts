import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicBoxComponent } from './academic-box.component';
import { CommonModule } from '@angular/common';

describe('AcademicBoxComponent', () => {
  let component: AcademicBoxComponent;
  let fixture: ComponentFixture<AcademicBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicBoxComponent,CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
