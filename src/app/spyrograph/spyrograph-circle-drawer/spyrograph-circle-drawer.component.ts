import {
  Component,
  computed,
  effect,
  ElementRef,
  Input,
  ViewChild,
  WritableSignal
} from '@angular/core'
import { Dimentions2d } from '../../shared/models/geometry/dimentions-2d.model'
import { RollingCircle } from '../models/rolling-circle.model'
import { Point2d } from '../../shared/models/geometry/point-2d.model'
import { GraphicCircle } from '../../shared/models/graphics/graphic-circle.model'
import { RollingCircleUtils } from '../util/rolling-circle.util'

@Component({
  selector: 'klife-spyrograph-circle-drawer',
  standalone: true,
  imports: [],
  templateUrl: './spyrograph-circle-drawer.component.html',
  styleUrl: './spyrograph-circle-drawer.component.scss',
})
export class SpyrographCircleDrawerComponent {
  @ViewChild('circleCanvas', { static: true })
  circleCanvasRef!: ElementRef<HTMLCanvasElement>

  @Input()
  circles!: RollingCircle[]
  @Input()
  center!: Point2d
  @Input()
  alwaysDraw = false

  canvasContainer!: HTMLDivElement
  circleCanvas!: HTMLCanvasElement
  circleContext!: CanvasRenderingContext2D

  drawOnInit = true

  ngOnInit() {
    this.circleCanvas = this.circleCanvasRef.nativeElement
    this.resize(this.circleCanvas)

    const context = this.circleCanvas.getContext('2d')
    if (context) {
      this.circleContext = context
      this.circleContext.translate(0.5, 0.5)
    }
    if (this.drawOnInit) {
      this.drawCircles()
    }
  }

  public drawCircles() {
    this.resize(this.circleCanvas)
    for (const circle of this.circles) {
      this.drawBaseCircle(circle)
      this.drawRollingCircle(circle) 
      this.drawDrawingPoint(circle)
    }
  }

  resize(canvas: HTMLCanvasElement) {
    canvas.height = this.center.y * 2
    canvas.width = this.center.x * 2
    
    if (this.circleContext) {
      this.circleContext.translate(0.5, 0.5)
    }
  }

  drawBaseCircle(circle: RollingCircle) {
    this.drawGraphicCircle(circle.baseCircle, circle.baseCircle.position, false)
  }

  drawRollingCircle(circle: RollingCircle) {
    const position = RollingCircleUtils.getRollingCirclePosition(circle)
    this.drawGraphicCircle(circle, position)
  }

  drawDrawingPoint(circle: RollingCircle) {
    const circlePosition = {x: circle.baseCircle.position.x + circle.position.x, y: circle.baseCircle.position.y + circle.position.y}
    const position = {x: circlePosition.x + circle.drawingPoint.position.x, y: circlePosition.y + circle.drawingPoint.position.y}
    this.drawGraphicCircle(circle.drawingPoint, position)
  }

  drawGraphicCircle(circle: GraphicCircle, position: Point2d, includeAlwaysDraw = true) {
    const ctx = this.circleContext
    ctx.strokeStyle = circle.strokeColor
    ctx.fillStyle = circle.fillColor
    ctx.lineWidth = circle.lineWidth
    ctx.beginPath()
    ctx.arc(position.x, position.y, circle.radius, 0, Math.PI * 2)
    if (circle.stroke || (this.alwaysDraw && includeAlwaysDraw)) {
      ctx.stroke()
    }
    if (circle.fill || (this.alwaysDraw && includeAlwaysDraw)) {
      ctx.fill()
    }
    ctx.closePath()
    ctx.closePath()
  }
}
