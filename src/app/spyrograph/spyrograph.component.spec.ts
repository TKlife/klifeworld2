import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpyrographComponent } from './spyrograph.component';

describe('SpyrographComponent', () => {
  let component: SpyrographComponent;
  let fixture: ComponentFixture<SpyrographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpyrographComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpyrographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
