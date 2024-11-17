import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpyrographParamEditorComponent } from './spyrograph-param-editor.component';

describe('SpyrographParamEditorComponent', () => {
  let component: SpyrographParamEditorComponent;
  let fixture: ComponentFixture<SpyrographParamEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpyrographParamEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpyrographParamEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
