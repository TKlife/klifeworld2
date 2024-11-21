import { Component, effect, ElementRef, Input, ViewChild, ɵCurrencyIndex } from '@angular/core';
import { RollingCircle } from '../models/rolling-circle.model';
import { Point2d } from '../../shared/models/geometry/point-2d.model';
import { Dimentions2d } from '../../shared/models/geometry/dimentions-2d.model';
import { SpyrographCircleDrawerComponent } from '../spyrograph-circle-drawer/spyrograph-circle-drawer.component';

@Component({
  selector: 'klife-spyrograph-pattern-drawer',
  standalone: true,
  imports: [],
  templateUrl: './spyrograph-pattern-drawer.component.html',
  styleUrl: './spyrograph-pattern-drawer.component.scss'
})
export class SpyrographPatternDrawerComponent extends SpyrographCircleDrawerComponent {
  @ViewChild('patterCanvas', {static: true})
  patterCanvasRef!: ElementRef<HTMLCanvasElement>
  @Input()
  drawingPoints: {color: string, width: number, point: Point2d}[] = []

  patternCanvas!: HTMLCanvasElement
  patternContext!: CanvasRenderingContext2D

  lastPoints: Point2d[] = []

  override drawOnInit: boolean = false

  override ngOnInit() {
    super.ngOnInit()
    this.patternCanvas = this.patterCanvasRef.nativeElement
    this.resize(this.patternCanvas)

    const context = this.patternCanvas.getContext('2d')
    if (context) {
      this.patternContext = context
      this.patternContext.translate(0.5, 0.5)
    }
    if (this.drawOnInit) {
      this.drawCircles()
    }
  }

  animate() {
    for (const circle of this.circles) {
      this.resize(this.circleCanvas)
      this.drawBaseCircle(circle)
      this.drawRollingCircle(circle)
    }
    this.drawPattern()
    for (const circle of this.circles) {
      this.drawDrawingPoint(circle)
    }
  }

  drawPattern() {
    for (const [index, patternData] of this.drawingPoints.entries()) {
      const lastPoint = this.lastPoints[index]
      if (lastPoint) {
        this.patternContext.beginPath()
        this.patternContext.moveTo(lastPoint.x, lastPoint.y)
        this.patternContext.lineTo(patternData.point.x, patternData.point.y)
        this.patternContext.closePath()
        this.patternContext.strokeStyle = patternData.color
        this.patternContext.lineWidth = patternData.width
        this.patternContext.stroke()
      }
      this.lastPoints[index] = patternData.point
    }
  }

  clear() {
    this.resize(this.circleCanvas)
    this.resize(this.patternCanvas)
  }
}
