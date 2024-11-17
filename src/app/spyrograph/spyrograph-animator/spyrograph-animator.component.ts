import {
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core'
import { Dimentions2d } from '../../shared/models/geometry/dimentions-2d.model'
import { SpyrographCircleDrawerComponent } from '../spyrograph-circle-drawer/spyrograph-circle-drawer.component'
import { AnimatedCircle } from './animated-circle.model'
import { EventLoopService } from '../../shared/services/event-loop.service'
import { GeometryUtils } from '../../shared/utils/geometry.utils'
import { Point2d } from '../../shared/models/geometry/point-2d.model'

@Component({
  selector: 'klife-spyrograph-animator',
  standalone: true,
  imports: [SpyrographCircleDrawerComponent],
  templateUrl: './spyrograph-animator.component.html',
  styleUrl: './spyrograph-animator.component.scss',
})
export class SpyrographAnimatorComponent {
  @ViewChild('view', { static: true, read: ViewContainerRef })
  view!: ViewContainerRef
  @ViewChild('circleDrawer', { static: true })
  circleDrawer!: SpyrographCircleDrawerComponent
  @ViewChild('circleCanvas', { static: true })
  patternCanvasRef!: ElementRef<HTMLCanvasElement>
  @Input()
  circles: AnimatedCircle[] = []
  @Input()
  dimentions!: WritableSignal<Dimentions2d>

  eventLoop = inject(EventLoopService)

  patternCanvas!: HTMLCanvasElement
  patternContext!: CanvasRenderingContext2D

  ngOnInit() {
    this.patternCanvas = this.patternCanvasRef.nativeElement
    this.resize()

    const patternContext = this.patternCanvas.getContext('2d')
    if (patternContext) {
      this.patternContext = patternContext
      this.patternContext.translate(0.5, 0.5)
    }
    this.eventLoop.addContinuous('animate-spyrograph', {
      function: () => {
        this.draw()
        this.circleDrawer.draw()
      },
    })
  }

  resize() {
    this.patternCanvas.height = this.dimentions().height
    this.patternCanvas.width = this.dimentions().width

    if (this.patternContext) {
      this.patternContext.translate(0.5, 0.5)
    }
  }

  draw() {
    this.resize()
    const center = {
      x: this.dimentions().width / 2,
      y: this.dimentions().height / 2,
    }
    for (const circle of this.circles) {
      circle.totalDistance +=
        (circle.speed / (2 * Math.PI)) * GeometryUtils.getCircumfrence(circle)
      this.drawBaseCircle(circle, center)
      // circle.position = this.getCircleCenter(center, circle)
      this.updateAnimatedCircle(circle, center)
      // circle.drawingPoint.position = this.getCircleDrawingPoint(center, circle)
    }
  }

  private getCircleCenter(center: Point2d, circle: AnimatedCircle): Point2d {
    const baseCircumfrence = GeometryUtils.getCircumfrence(circle.baseCircle)
    const portion = circle.totalDistance / baseCircumfrence
    const angle = portion * (Math.PI * 2)
    let radius
    if (circle.interior) {
      radius = circle.baseCircle.radius - circle.radius
    } else {
      radius = circle.baseCircle.radius + circle.radius
    }
    return GeometryUtils.getPointFromPolar(radius, angle, center.x, center.y)
  }

  private getCircleDrawingPoint(
    center: Point2d,
    circle: AnimatedCircle
  ) {
    const p = circle.totalDistance / GeometryUtils.getCircumfrence(circle)
    const p2 = circle.totalDistance / GeometryUtils.getCircumfrence(circle.baseCircle)
    let theta
    if (circle.interior) {
      theta = p2 * (2 * Math.PI) - p * (Math.PI * 2)
    } else {
      theta = (p2 + p) * (Math.PI * 2) 
    }

    return GeometryUtils.getPointFromPolar(
      50,
      theta,
    )
  }

  private updateAnimatedCircle(circle: AnimatedCircle, center: Point2d) {
    circle.rotation += circle.speed

    const baseCircleCircumfrence = GeometryUtils.getCircumfrence(circle.baseCircle)

    const distToCenter = GeometryUtils.lengthOfLine(center, circle.position)
    const totalDistTravled = circle.rotation * circle.radius
    const baseRotation = (totalDistTravled / baseCircleCircumfrence) * (2 * Math.PI)
    const newCenter = GeometryUtils.getPointFromPolar(distToCenter, baseRotation)
    GeometryUtils.translatePoint(newCenter, center.x, center.y)

    // const distToDrawingPointCenter = GeometryUtils.lengthOfLine(circle.position, { x: circle.position.x + circle.drawingPoint.position.x, y: circle.position.y + circle.drawingPoint.position.y })
    // const newDrawingCenter = GeometryUtils.getPointFromPolar(distToDrawingPointCenter, -circle.rotation)
    if (circle.interior) {
      circle.drawingPoint.polarPosition.theta -= circle.speed
    } else {
      circle.drawingPoint.polarPosition.theta += circle.speed
      const distTraveledAroundCircle = (circle.speed / (2 * Math.PI)) * GeometryUtils.getCircumfrence(circle)
      circle.drawingPoint.polarPosition.theta += (distTraveledAroundCircle / baseCircleCircumfrence) * (2 * Math.PI)
    }

    circle.position = newCenter
    circle.drawingPoint.position = GeometryUtils.getPointFromPolar(circle.drawingPoint.polarPosition.radius, circle.drawingPoint.polarPosition.theta)
  }

  drawBaseCircle(circle: AnimatedCircle, center: Point2d) {
    const ctx = this.patternContext
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.beginPath()
    // ctx.moveTo(center.x, center.y)
    ctx.arc(center.x, center.y, circle.baseCircle.radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
  }

  private getRandomColor(): string | CanvasGradient | CanvasPattern {
    const rand = Math.random()
    if (rand < 0.33) {
      return '#00FF00'
    } else if (rand < 0.66) {
      return '#00FFFF'
    } else {
      return '#0000FF'
    }
  }
}
