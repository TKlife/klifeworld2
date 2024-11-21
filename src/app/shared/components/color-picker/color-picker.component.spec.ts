import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlifeColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: KlifeColorPickerComponent;
  let fixture: ComponentFixture<KlifeColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlifeColorPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KlifeColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
