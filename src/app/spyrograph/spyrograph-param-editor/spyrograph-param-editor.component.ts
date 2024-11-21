import { ApplicationRef, Component, ComponentRef, createComponent, effect, ElementRef, EventEmitter, inject, Input, Output, ViewChild, WritableSignal } from '@angular/core';
import { RollingCircle } from '../models/rolling-circle.model';
import { SpyrographCircleDrawerComponent } from '../spyrograph-circle-drawer/spyrograph-circle-drawer.component';
import { Dimentions2d } from '../../shared/models/geometry/dimentions-2d.model';
import { EventLoopService } from '../../shared/services/event-loop.service';
import { ThisReceiver } from '@angular/compiler';
import { GeometryUtils } from '../../shared/utils/geometry.utils';
import { Point2d } from '../../shared/models/geometry/point-2d.model';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RollingCircleUtils } from '../util/rolling-circle.util';
import { debounce, distinctUntilChanged, interval, Subject, timer } from 'rxjs';
import { KlifeColorPickerComponent } from '../../shared/components/color-picker/color-picker.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { EventLoop } from '../../shared/models/event-loop';

@Component({
  selector: 'klife-spyrograph-param-editor',
  standalone: true,
  imports: [SpyrographCircleDrawerComponent, FormsModule, CommonModule, ColorPickerModule],
  templateUrl: './spyrograph-param-editor.component.html',
  styleUrl: './spyrograph-param-editor.component.scss'
})
export class SpyrographParamEditorComponent {
  eventLoop = new EventLoop(30)

  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>
  @ViewChild('drawer', { static: true })
  drawer!: SpyrographCircleDrawerComponent
  @Input()
  circles!: RollingCircle[]
  @Input()
  center!: Point2d
  @Output()
  startAnimation = new EventEmitter<void>()

  selectedCircle!: RollingCircle
  drawnCircles: RollingCircle[] = []
  mouseUpListener = this.mouseUp.bind(this)
  moveRollingCircleEvent = this.moveRollingCircle.bind(this)
  moveBaseCircleEvent = this.moveBaseCircle.bind(this)
  boundMouseMove: any

  baseCircleRadiusSubject = new Subject<number>()

  circlePositionString: string = ''

  applicationRef = inject(ApplicationRef)

  constructor() {

  }

  ngOnInit() {
    this.selectedCircle = this.circles[0]
    if (this.selectedCircle) {
      this.drawnCircles.push(this.selectedCircle)
      this.circlePositionString = this.getPositionString(RollingCircleUtils.getRollingCirclePosition(this.selectedCircle))
    }

    this.baseCircleRadiusSubject.pipe(
      debounce((v) => timer(300)),
      distinctUntilChanged()
    ).subscribe(v => {
      this.updateBaseCircle()
    })
  }

  private getPositionString(position: Point2d): string {
    return `(${position.x.toFixed(2)}, ${position.x.toFixed(2)})`;
  }

  onMouseDown(event: MouseEvent) {
    if (event.target instanceof HTMLCanvasElement) {
      if (this.selectedCircle) {
        const rollingCircleCenter = RollingCircleUtils.getRollingCirclePosition(this.selectedCircle)
        const mouse = this.getMousePosition(event)
        if (this.insideCircle(mouse, rollingCircleCenter, this.selectedCircle.radius)) {
          this.eventLoop.addEvent('param_mouse_down', {
            function: () => {
              this.container.nativeElement.addEventListener('mousemove', this.moveRollingCircleEvent)
            }
          }) 
          this.boundMouseMove = this.moveRollingCircleEvent
          this.eventLoop.startEventLoop()
        } else if(this.insideCircle(mouse, this.selectedCircle.baseCircle.position, this.selectedCircle.baseCircle.radius)) {
          this.eventLoop.addEvent('param_mouse_down', {
            function: () => {
              this.container.nativeElement.addEventListener('mousemove', this.moveBaseCircleEvent)
            }
          }) 
          this.boundMouseMove = this.moveBaseCircleEvent
          this.eventLoop.startEventLoop()
        }
      }
    }
    }

  insideCircle(mouse: Point2d, center: Point2d, radius: number) {
    const dist = GeometryUtils.lengthOfLine(center, mouse)
    if (dist < radius) {
      return true
    }

    return false
  }

  mouseUp() {
    if (this.boundMouseMove) {
      this.eventLoop.addEvent('param_mouse_up', {
        function: () => {
          this.container.nativeElement.removeEventListener('mousemove', this.boundMouseMove)
          this.eventLoop.removeEvent('param_mouse_move')
          this.boundMouseMove = undefined
        }
      }) 
    }
  }

  moveRollingCircle(event: MouseEvent) {
    this.eventLoop.addEvent('param_mouse_move', {
      function: () => {   
        if (this.selectedCircle) {
          const mouse = this.getMousePosition(event);
          const center = RollingCircleUtils.getRollingCirclePosition(this.selectedCircle)
          this.selectedCircle.position.x += (mouse.x - center.x)
          this.selectedCircle.position.y += (mouse.y - center.y)
          this.updateCircle()
        } 
      }
    })
  }

  moveBaseCircle(event: MouseEvent) {
    this.eventLoop.addEvent('param_mouse_move', {
      function: () => {   
        
        if (this.selectedCircle) {
          const mouse = this.getMousePosition(event);
          const center = this.selectedCircle.baseCircle.position
          this.selectedCircle.baseCircle.position.x += (mouse.x - center.x)
          this.selectedCircle.baseCircle.position.y += (mouse.y - center.y)
          this.updateCircle()
        }
      }
    })
  }

  private getMousePosition(event: MouseEvent) {
    const x = event.x;
    const y = event.y;
    const rect = this.container.nativeElement.getBoundingClientRect();
    return {
      x: x - rect.left,
      y: y - rect.top
    };
  }

  onInput() {
    this.updateCircle()
  }

  updateCircle() {
    if (this.selectedCircle) {
      this.selectedCircle.radius = Number(this.selectedCircle.radius.toFixed(2))
      this.selectedCircle.polarPosition = GeometryUtils.getPolarFromPoint({x: this.selectedCircle.position.x, y: this.selectedCircle.position.y})
      this.selectedCircle.baseCircle.radius = RollingCircleUtils.getBaseCircleRadius(this.selectedCircle)
      this.circlePositionString = this.getPositionString(RollingCircleUtils.getRollingCirclePosition(this.selectedCircle))
      this.drawer.drawCircles()
    }
  
  }

  updateBaseCircle() {
    if (this.selectedCircle) {
      this.selectedCircle.baseCircle.radius = Number(this.selectedCircle.baseCircle.radius.toFixed(2))
      this.selectedCircle.baseCircle.polarPosition = GeometryUtils.getPolarFromPoint({x: this.selectedCircle.baseCircle.position.x, y: this.selectedCircle.baseCircle.position.y})
  
      const oldRadius = RollingCircleUtils.getBaseCircleRadius(this.selectedCircle)
      const delta = this.selectedCircle.baseCircle.radius - oldRadius
      this.selectedCircle.polarPosition.radius += delta
      this.selectedCircle.position = GeometryUtils.getPointFromPolar(this.selectedCircle.polarPosition.radius, this.selectedCircle.polarPosition.theta)
      this.circlePositionString = this.getPositionString(RollingCircleUtils.getRollingCirclePosition(this.selectedCircle))
      this.drawer.drawCircles()
    }
  }

  updateDrawingPoint() {
    if (this.selectedCircle) {
      GeometryUtils.roundPoint(this.selectedCircle.drawingPoint.position)
      this.selectedCircle.drawingPoint.polarPosition = GeometryUtils.getPolarFromPoint(this.selectedCircle.drawingPoint.position)
      this.drawer.drawCircles()
    }
  }

  selectCircle(circle: RollingCircle) {
    this.selectedCircle = circle
    this.drawnCircles.splice(0, this.drawnCircles.length, circle)
    this.drawer.drawCircles()
  }

  addCircle() {
    const circle = this.getNewCircle()
    this.selectedCircle = circle
    this.circles.push(circle)
    this.drawnCircles.splice(0, this.drawnCircles.length, circle)
    this.drawer.drawCircles()
  }

  removeCircle() {
    let selectedCircleIndex
    for (const [index, circle] of this.circles.entries()) {
      if (circle === this.selectedCircle) {
        selectedCircleIndex = index
        break
      }
    }

    if (selectedCircleIndex != undefined) {
      this.circles.splice(selectedCircleIndex, 1)
    }

    this.selectedCircle = this.circles[0]

    this.drawer.drawCircles()
  }

  openColorPicker(div: HTMLDivElement, updateColor: (color: string) => void, update: () => void) {
    const comp = createComponent(KlifeColorPickerComponent, {environmentInjector: this.applicationRef.injector})
    comp.instance.top = div.clientHeight
    comp.instance.left = div.clientWidth
    div.appendChild(comp.location.nativeElement)
    comp.instance.open()
  }

  getNewCircle() {
    return RollingCircleUtils.getNewRollingCircle({...this.center})
  }
}
