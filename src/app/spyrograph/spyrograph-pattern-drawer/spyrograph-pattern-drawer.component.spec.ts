import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpyrographPatternDrawerComponent } from './spyrograph-pattern-drawer.component';

describe('SpyrographPatternDrawerComponent', () => {
  let component: SpyrographPatternDrawerComponent;
  let fixture: ComponentFixture<SpyrographPatternDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpyrographPatternDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpyrographPatternDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
