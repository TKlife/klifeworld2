import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpyrographAnimatorComponent } from './spyrograph-animator.component';

describe('SpyrographAnimatorComponent', () => {
  let component: SpyrographAnimatorComponent;
  let fixture: ComponentFixture<SpyrographAnimatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpyrographAnimatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpyrographAnimatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
