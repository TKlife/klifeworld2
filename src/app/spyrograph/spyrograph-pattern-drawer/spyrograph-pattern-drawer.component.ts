import { Component, effect, ElementRef, Input, ViewChild } from '@angular/core';
import { RollingCircle } from '../models/rolling-circle.model';
import { Point2d } from '../../shared/models/geometry/point-2d.model';
import { Dimentions2d } from '../../shared/models/geometry/dimentions-2d.model';

@Component({
  selector: 'klife-spyrograph-pattern-drawer',
  standalone: true,
  imports: [],
  templateUrl: './spyrograph-pattern-drawer.component.html',
  styleUrl: './spyrograph-pattern-drawer.component.scss'
})
export class SpyrographPatternDrawerComponent {
  @ViewChild('patternCanvas', {static: true})
  patterCanvasRef!: ElementRef<HTMLCanvasElement>
  @Input()
  drawingPoints: {color: string, point: Point2d}[] = []
  @Input()
  center!: Point2d

  patternCanvas!: HTMLCanvasElement
  patternContext!: CanvasRenderingContext2D

  lastPoints: Point2d[] = []

  constructor() {
    effect(() => {
      this.draw()
    })
  }

  ngOnInit() {    
    this.patternCanvas = this.patterCanvasRef.nativeElement
    this.resize()
    
    const patternContext = this.patternCanvas.getContext('2d')
    if (patternContext) {
      this.patternContext = patternContext
      this.patternContext.translate(0.5, 0.5)
    }
    for (const [index, point] of this.drawingPoints.entries()) {
      this.lastPoints[index] = point.point
    }
  }

  resize() {
    this.patternCanvas.height = this.center.y * 2
    this.patternCanvas.width = this.center.x * 2
    
    if (this.patternContext) {
      this.patternContext.translate(0.5, 0.5)
    }
  }

  draw() {
    for (const [index, point] of this.drawingPoints.entries()) {
      const lastPoint = this.lastPoints[index]
      if (lastPoint) {
        this.patternContext.beginPath()
        this.patternContext.moveTo(lastPoint.x, lastPoint.y)
        this.patternContext.lineTo(point.point.x, point.point.y)
        this.patternContext.closePath()
        this.patternContext.strokeStyle = point.color
        this.patternContext.lineWidth = 2
        this.patternContext.stroke()
      }
      this.lastPoints[index] = point.point
    }
  }
}
