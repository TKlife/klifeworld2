import { Component, ComponentRef, effect, EventEmitter, inject, Input, Output, ViewChild, WritableSignal } from '@angular/core';
import { RollingCircle } from '../models/rolling-circle.model';
import { SpyrographCircleDrawerComponent } from '../spyrograph-circle-drawer/spyrograph-circle-drawer.component';
import { Dimentions2d } from '../../shared/models/geometry/dimentions-2d.model';
import { EventLoopService } from '../../shared/services/event-loop.service';
import { ThisReceiver } from '@angular/compiler';
import { GeometryUtils } from '../../shared/utils/geometry.utils';
import { Point2d } from '../../shared/models/geometry/point-2d.model';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'klife-spyrograph-param-editor',
  standalone: true,
  imports: [SpyrographCircleDrawerComponent, FormsModule, CommonModule],
  templateUrl: './spyrograph-param-editor.component.html',
  styleUrl: './spyrograph-param-editor.component.scss'
})
export class SpyrographParamEditorComponent {
  eventLoop = inject(EventLoopService)

  @ViewChild('drawer', { static: true })
  drawer!: SpyrographCircleDrawerComponent
  @Input()
  circles!: WritableSignal<RollingCircle[]>
  @Input()
  center!: Point2d
  @Output()
  startAnimation = new EventEmitter<void>()

  selectedCircle?: RollingCircle
  mouseUpListener = this.mouseUp.bind(this)
  mouseMoveEvent = this.mousemove.bind(this)

  constructor() {

  }

  ngOnInit() {
    this.selectedCircle = this.circles()[0]
  }

  insideCircle(event: MouseEvent, container: HTMLDivElement) {
    const x = event.x
    const y = event.y
    const rect = container.getBoundingClientRect()
    for (const circle of this.circles()) {
      const center = circle.position
      const mouse = {
        x: x - rect.left,
        y: y - rect.top
      }
      const dist = GeometryUtils.lengthOfLine(center, mouse)
      if (dist < circle.radius) {
        this.selectedCircle = circle
        this.eventLoop.addEvent('param_mouse_down', {
          function: () => {
            container.addEventListener('mousemove', this.mouseMoveEvent)
          }
        }) 
        break
      }
    }
    
  }

  mouseUp(event: MouseEvent, container: HTMLDivElement) {
    this.eventLoop.addEvent('param_mouse_up', {
      function: () => {
        // this.selectedCircle = undefined
        this.removeMouseMoveEvent(container)
        this.eventLoop.removeEvent('param_mouse_move')
      }
    }) 
  }

  mousemove(event: MouseEvent) {
    this.eventLoop.addEvent('param_mouse_move', {
      function: () => {
        if (this.selectedCircle) {
          this.selectedCircle.position.x = event.x
          this.selectedCircle.position.y = event.y
          this.updateCircle(this.selectedCircle)
        }
      }
    })
  }

  removeMouseMoveEvent(container: HTMLDivElement) {
    container.removeEventListener('mousemove', this.mouseMoveEvent)
  }

  onInput(circle: RollingCircle) {
    console.log(circle.position.y)
    this.updateCircle(circle)
  }

  updateCircle(circle: RollingCircle) {
    if (this.selectedCircle) {
      circle.polarPosition = GeometryUtils.getPolarFromPoint({x: circle.position.x - this.center.x, y: circle.position.y - this.center.y})
      circle.drawingPoint.polarPosition = GeometryUtils.getPolarFromPoint(circle.drawingPoint.position)
      circle.baseCircle.radius = GeometryUtils.lengthOfLine({x: this.center.x, y: this.center.y}, circle.position) + circle.radius
      this.drawer.draw()
    }
  }
}
