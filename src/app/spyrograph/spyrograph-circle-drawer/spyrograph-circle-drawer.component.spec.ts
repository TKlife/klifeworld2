import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpyrographCircleDrawerComponent } from './spyrograph-circle-drawer.component';

describe('SpyrographCanvasComponent', () => {
  let component: SpyrographCircleDrawerComponent;
  let fixture: ComponentFixture<SpyrographCircleDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpyrographCircleDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpyrographCircleDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
