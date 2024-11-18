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
import { bindCallback } from 'rxjs'
import { SpyrographPatternDrawerComponent } from "../spyrograph-pattern-drawer/spyrograph-pattern-drawer.component";

@Component({
  selector: 'klife-spyrograph-animator',
  standalone: true,
  imports: [SpyrographCircleDrawerComponent, SpyrographPatternDrawerComponent],
  templateUrl: './spyrograph-animator.component.html',
  styleUrl: './spyrograph-animator.component.scss',
})
export class SpyrographAnimatorComponent {
  @ViewChild('view', { static: true, read: ViewContainerRef })
  view!: ViewContainerRef
  @ViewChild('circleDrawer', { static: true })
  circleDrawer!: SpyrographCircleDrawerComponent
  @ViewChild('patternDrawer', { static: true })
  patternDrawer!: SpyrographPatternDrawerComponent
  @Input()
  circles: AnimatedCircle[] = []
  @Input()
  center!: Point2d

  eventLoop = inject(EventLoopService)
  patternPoints: {color: string, point: Point2d}[] = []

  ngOnInit() {
    this.updatePatternData()
    for (const [index, point] of this.patternPoints.entries()) {
      this.patternDrawer.lastPoints[index] = point.point
    }
    this.eventLoop.addContinuous('animate-spyrograph', {
      function: () => {
        this.updateCircleData()
        this.circleDrawer.draw()
        this.updatePatternData()
        this.patternDrawer.drawingPoints = this.patternPoints
        this.patternDrawer.draw()
      },
    })
  }

  updateCircleData() {
    for (const circle of this.circles) {
      this.updateAnimatedCircle(circle)
    }
  }

  private updateAnimatedCircle(circle: AnimatedCircle) {
    const baseCircleCircumfrence = GeometryUtils.getCircumfrence(circle.baseCircle)
    const distTraveledAroundCircle = (circle.speed / (2 * Math.PI)) * GeometryUtils.getCircumfrence(circle)
    const angleTraveldAroundBaseCircle = (distTraveledAroundCircle / baseCircleCircumfrence) * (2 * Math.PI)
    circle.polarPosition.theta += angleTraveldAroundBaseCircle 
    circle.position = GeometryUtils.getPointFromPolar(circle.polarPosition.radius, circle.polarPosition.theta, this.center.x, this.center.y)
    
    if (circle.interior) {
      circle.drawingPoint.polarPosition.theta += (angleTraveldAroundBaseCircle - circle.speed)
    } else {
      circle.drawingPoint.polarPosition.theta += circle.speed
      circle.drawingPoint.polarPosition.theta += angleTraveldAroundBaseCircle
    }
    circle.drawingPoint.position = GeometryUtils.getPointFromPolar(circle.drawingPoint.polarPosition.radius, circle.drawingPoint.polarPosition.theta)
  }

  updatePatternData() {
    this.patternPoints = []

    for (const circle of this.circles) {
      const point: Point2d = {
        x: circle.position.x + circle.drawingPoint.position.x,
        y: circle.position.y + circle.drawingPoint.position.y
      } 
      this.patternPoints.push({
        color: circle.drawingPoint.strokeColor,
        point
      })
    }
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
