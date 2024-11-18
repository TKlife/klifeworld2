import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  Signal,
  signal,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core'
import { Dimentions2d } from '../shared/models/geometry/dimentions-2d.model'
import { Point2d } from '../shared/models/geometry/point-2d.model'
import { RollingCircle } from './models/rolling-circle.model'
import { SpyrographParamEditorComponent } from './spyrograph-param-editor/spyrograph-param-editor.component'
import { SpyrographAnimatorComponent } from './spyrograph-animator/spyrograph-animator.component'
import { AnimatedCircle } from './spyrograph-animator/animated-circle.model'
import { GeometryUtils } from '../shared/utils/geometry.utils'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'klife-spyrograph',
  standalone: true,
  imports: [SpyrographParamEditorComponent, SpyrographAnimatorComponent, CommonModule],
  templateUrl: './spyrograph.component.html',
  styleUrl: './spyrograph.component.scss',
})
export class SpyrographComponent {
  @ViewChild('view', { static: true, read: ViewContainerRef })
  view!: ViewContainerRef

  element = inject(ElementRef)
  dimentions: WritableSignal<Dimentions2d> = signal({ height: 0, width: 0 })
  center: Signal<Point2d> = computed(() => {
    return {
      x: this.dimentions().width / 2,
      y: this.dimentions().height / 2,
    }
  })
  rollingCircles: WritableSignal<RollingCircle[]> = signal([])
  startedAnimation = false

  ngOnInit() {
    this.resize()
    const circle = this.createRollingCircle()
    circle.drawingPoint.position = GeometryUtils.getPointFromPolar(circle.drawingPoint.polarPosition.radius, circle.drawingPoint.polarPosition.theta)
    this.rollingCircles.set([circle])
  }

  @HostListener('window:resize', ['event'])
  resize() {
    this.dimentions.set({
      height: this.element.nativeElement.clientHeight,
      width: this.element.nativeElement.clientWidth,
    })
  }

  startAnimation() {
    this.startedAnimation = true
  }

  createRollingCircle(interior = true): RollingCircle {
    const radius = 140
    const position = {x: this.center().x + 290, y: this.center().y}
    const polarPosition = GeometryUtils.getPolarFromPoint({x: position.x - this.center().x, y: position.y - this.center().y})
    const baseCircleRadius = GeometryUtils.lengthOfLine(this.center(), position) + radius
    return {
      radius,
      position,
      polarPosition,
      speed: .2,
      strokeColor: '#FF0000',
      fillColor: '#FF0000',
      opacity: 1,
      lineWidth: 1,
      drawingPoint: {
        radius: 5,
        position: { x: 0, y: 0 },
        polarPosition: {radius: 70, theta: 0},
        opacity: 1,
        lineWidth: 1,
        strokeColor: '#FF9911',
        fillColor: '#FF9911',
        stroke: true,
        fill: true,
      },
      baseCircle: {
        radius: baseCircleRadius,
        position: this.center(),
        polarPosition: {radius: 0, theta: 0}, 
        opacity: 1,
        lineWidth: 1,
        strokeColor: '#009988',
        fillColor: '#009988',
        stroke: true,
        fill: true,
      },
      interior: interior,
      stroke: true,
      fill: true,
    }
  }
}
