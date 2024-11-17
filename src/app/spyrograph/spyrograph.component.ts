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
import { SpyrographCircleDrawerComponent } from './spyrograph-circle-drawer/spyrograph-circle-drawer.component'
import { SpyrographParamEditorComponent } from './spyrograph-param-editor/spyrograph-param-editor.component'
import { SpyrographAnimatorComponent } from './spyrograph-animator/spyrograph-animator.component'
import { AnimatedCircle } from './spyrograph-animator/animated-circle.model'
import { GeometryUtils } from '../shared/utils/geometry.utils'

@Component({
  selector: 'klife-spyrograph',
  standalone: true,
  imports: [SpyrographCircleDrawerComponent, SpyrographParamEditorComponent],
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

  ngOnInit() {
    this.resize()
    const circle = this.createRollingCircle()
    circle.drawingPoint.position = GeometryUtils.getPointFromPolar(circle.drawingPoint.polarPosition.radius, circle.drawingPoint.polarPosition.theta)
    this.rollingCircles.set([circle])
    this.createParamComponent()
  }

  private createParamComponent() {
    const paramRef = this.view.createComponent(SpyrographParamEditorComponent)
    paramRef.instance.circles = this.rollingCircles
    paramRef.instance.dimentions = this.dimentions
    paramRef.instance.startAnimation.subscribe(() => {
      const animatedCircles = this.rollingCircles().map((c) =>
        this.createAnimatedCircle(c)
      )
      this.view.clear()
      const animator = this.view.createComponent(SpyrographAnimatorComponent)
      animator.instance.circles = animatedCircles
      animator.instance.dimentions = this.dimentions
    })
  }

  @HostListener('window:resize', ['event'])
  resize() {
    this.dimentions.set({
      height: this.element.nativeElement.clientHeight,
      width: this.element.nativeElement.clientWidth,
    })
  }

  createRollingCircle(): RollingCircle {
    return {
      radius: 100,
      position: { x: this.center().x + 200, y: this.center().y },
      speed: .1,
      strokeColor: '#FF0000',
      fillColor: '#FF0000',
      opacity: 1,
      lineWidth: 1,
      drawingPoint: {
        radius: 10,
        position: { x: 0, y: 0 },
        polarPosition: {radius: 50, theta: Math.PI},
        opacity: 1,
        lineWidth: 1,
        strokeColor: '#000000',
        fillColor: '#000000',
        stroke: true,
        fill: true,
      },
      show: true,
      showDrawingPoint: true,
      stroke: true,
      fill: true,
    }
  }

  createAnimatedCircle(circle: RollingCircle, interior = true): AnimatedCircle {
    const center = {
      x: this.dimentions().width / 2,
      y: this.dimentions().height / 2,
    }
    const pointFromOrigin = GeometryUtils.getTranslatedPoint(
      circle.position,
      -center.x,
      -center.y
    )
    pointFromOrigin.y = -pointFromOrigin.y
    const polar = GeometryUtils.getPolarFromPoint(pointFromOrigin)
    const distToCenter = GeometryUtils.lengthOfLine(center, circle.position)
    // const
    return {
      ...circle,
      totalDistance: 0,
      rotation: polar.theta,
      baseCircle: {
        radius: distToCenter + (interior ? circle.radius : -circle.radius),
      },
      interior: interior
    }
  }
}
