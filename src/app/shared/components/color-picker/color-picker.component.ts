import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ColorPickerComponent, ColorPickerDirective, ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'klife-color-picker',
  standalone: true,
  imports: [ColorPickerModule],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class KlifeColorPickerComponent extends ColorPickerDirective{
  @ViewChild('picker', { static: true })
  picker!: ElementRef<HTMLInputElement>

  top: number = 0
  left: number = 0
  color: string = '#000000'

  @Output()
  close = new EventEmitter<void>()

  open() {
    
  }
}
