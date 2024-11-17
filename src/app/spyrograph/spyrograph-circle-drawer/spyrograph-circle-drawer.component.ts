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
  dimentions!: WritableSignal<Dimentions2d>

  canvasContainer!: HTMLDivElement
  patternCanvas!: HTMLCanvasElement
  patternContext!: CanvasRenderingContext2D
  circleCanvas!: HTMLCanvasElement
  circleContext!: CanvasRenderingContext2D


  ngOnInit() {
    this.circleCanvas = this.circleCanvasRef.nativeElement
    this.resize()

    const circleContext = this.circleCanvas.getContext('2d')
    if (circleContext) {
      this.circleContext = circleContext
      this.circleContext.translate(0.5, 0.5)
    }
    this.draw()
  }

  public draw() {
    this.resize()
    for (const selectedCircle of this.circles) {
      this.drawRollingCircle(selectedCircle)
    }
  }

  resize() {
    this.circleCanvas.height = this.dimentions().height
    this.circleCanvas.width = this.dimentions().width
    
    if (this.circleContext) {
      this.circleContext.translate(0.5, 0.5)
    }
  }

  drawRollingCircle(selectedCircle: RollingCircle) {
    const ctx = this.circleContext
    ctx.strokeStyle = selectedCircle.strokeColor
    ctx.fillStyle = selectedCircle.fillColor
    this.drawCircle(ctx, selectedCircle)
    this.drawDrawingPoint(selectedCircle, ctx)
  }

  private drawDrawingPoint(circle: RollingCircle, ctx: CanvasRenderingContext2D) {
    const drawingPoint = circle.drawingPoint
    ctx.strokeStyle = drawingPoint.strokeColor
    ctx.fillStyle = drawingPoint.fillColor
    ctx.beginPath()
    ctx.arc(circle.position.x + drawingPoint.position.x, circle.position.y + drawingPoint.position.y, drawingPoint.radius, 0, Math.PI * 2)
    if (drawingPoint.stroke) {
      ctx.stroke()
    }
    if (drawingPoint.fill) {
      ctx.fill()
    }
    ctx.closePath()
    ctx.beginPath()
    ctx.moveTo(circle.position.x + drawingPoint.position.x, circle.position.y + drawingPoint.position.y)
    ctx.lineTo(circle.position.x, circle.position.y)
    ctx.closePath()
    ctx.stroke()
  }

  private drawCircle(ctx: CanvasRenderingContext2D, circle: RollingCircle) {
    ctx.beginPath()
    ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2)
    if (circle.stroke) {
      ctx.stroke()
    }
    if (circle.fill) {
      ctx.fill()
    }
    ctx.closePath()
  }
}
