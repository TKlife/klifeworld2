import {
  Component,
  inject,
  Input,
  ViewChild,
  ViewContainerRef
} from '@angular/core'
import { Point2d } from '../../shared/models/geometry/point-2d.model'
import { EventLoopService } from '../../shared/services/event-loop.service'
import { GeometryUtils } from '../../shared/utils/geometry.utils'
import { SpyrographCircleDrawerComponent } from '../spyrograph-circle-drawer/spyrograph-circle-drawer.component'
import { SpyrographPatternDrawerComponent } from "../spyrograph-pattern-drawer/spyrograph-pattern-drawer.component"
import { AnimatedCircle } from './animated-circle.model'
import { PolarPoint2d } from '../../shared/models/geometry/polar-point-2d.model'
import { RollingCircle } from '../models/rolling-circle.model'
import { RollingCircleUtils } from '../util/rolling-circle.util'
import { EventLoop } from '../../shared/models/event-loop'

@Component({
  selector: 'klife-spyrograph-animator',
  standalone: true,
  imports: [SpyrographPatternDrawerComponent],
  templateUrl: './spyrograph-animator.component.html',
  styleUrl: './spyrograph-animator.component.scss',
})
export class SpyrographAnimatorComponent {
  private readonly ANIMATE_EVENT_KEY = 'animate-spyrograph'
  
  @ViewChild('view', { static: true, read: ViewContainerRef })
  view!: ViewContainerRef
  @ViewChild('patternDrawer', { static: true })
  patternDrawer!: SpyrographPatternDrawerComponent
  @Input()
  circles: RollingCircle[] = []
  @Input()
  center!: Point2d

  eventLoop = inject(EventLoopService)
  patternPoints: {color: string, width: number, point: Point2d}[] = []
  initialPosition: {position: Point2d, polarPosition: PolarPoint2d, drawingPointPosition: Point2d, drawingPointPolarPosition: PolarPoint2d}[] = []

  ngOnInit() {
    this.resetPatternData()

    for (const [index, circle] of this.circles.entries()) {
      this.initialPosition[index] = {
        position: {...circle.position}, 
        polarPosition: {...circle.polarPosition},
        drawingPointPosition: {...circle.drawingPoint.position}, 
        drawingPointPolarPosition: {...circle.drawingPoint.polarPosition}
      }
    }
    this.eventLoop.addContinuous(this.ANIMATE_EVENT_KEY, {
      function: () => {
        this.updateCircleData()
        this.updatePatternData()
        this.patternDrawer.drawingPoints = this.patternPoints
        this.patternDrawer.animate()
      },
    })
  }

  private resetPatternData() {
    this.updatePatternData()
    for (const [index, patternData] of this.patternPoints.entries()) {
      this.patternDrawer.drawingPoints = this.patternPoints
      this.patternDrawer.lastPoints[index] = patternData.point
    }
  }

  updateCircleData() {
    for (const circle of this.circles) {
      if (circle.deltaByBase) {
        this.updateAnimatedCircleByBaseDelta(circle)
      } else {
        this.updateAnimatedCircleByCircleDelta(circle)
      }
    }
  }

  private updateAnimatedCircleByCircleDelta(circle: AnimatedCircle) {
    const baseCircleCircumfrence = GeometryUtils.getCircumfrence(circle.baseCircle)
    const distTraveledAroundCircle = (circle.deltaTheta / (2 * Math.PI)) * GeometryUtils.getCircumfrence(circle)
    const angleTraveldAroundBaseCircle = (distTraveledAroundCircle / baseCircleCircumfrence) * (2 * Math.PI)
    circle.polarPosition.theta += angleTraveldAroundBaseCircle 
    circle.position = GeometryUtils.getPointFromPolar(circle.polarPosition.radius, circle.polarPosition.theta)
    
    if (circle.interior) {
      circle.drawingPoint.polarPosition.theta += (angleTraveldAroundBaseCircle - circle.deltaTheta)
    } else {
      circle.drawingPoint.polarPosition.theta += circle.deltaTheta
      circle.drawingPoint.polarPosition.theta += angleTraveldAroundBaseCircle
    }
    circle.drawingPoint.position = GeometryUtils.getPointFromPolar(circle.drawingPoint.polarPosition.radius, circle.drawingPoint.polarPosition.theta)
  }

  private updateAnimatedCircleByBaseDelta(circle: AnimatedCircle) {
    const baseCircleCircumfrence = GeometryUtils.getCircumfrence(circle)
    const distTraveledAroundBaseCircle = (circle.deltaTheta / (2 * Math.PI)) * GeometryUtils.getCircumfrence(circle.baseCircle)
    const angleTraveldAroundCircle = (distTraveledAroundBaseCircle / baseCircleCircumfrence) * (2 * Math.PI)
    circle.polarPosition.theta += circle.deltaTheta 
    circle.position = GeometryUtils.getPointFromPolar(circle.polarPosition.radius, circle.polarPosition.theta)
    
    if (circle.interior) {
      circle.drawingPoint.polarPosition.theta += (circle.deltaTheta - angleTraveldAroundCircle)
    } else {
      circle.drawingPoint.polarPosition.theta += angleTraveldAroundCircle
      circle.drawingPoint.polarPosition.theta += circle.deltaTheta
    }
    circle.drawingPoint.position = GeometryUtils.getPointFromPolar(circle.drawingPoint.polarPosition.radius, circle.drawingPoint.polarPosition.theta)
  }

  updatePatternData() {
    this.patternPoints = []
    for (const circle of this.circles) {
      const point: Point2d = RollingCircleUtils.getDrawingPointPosition(circle)
      this.patternPoints.push({
        color: circle.patterColor,
        width: circle.patterLineWidth,
        point
      })
    }
  }

  reset() {
    this.patternDrawer.clear()
    this.eventLoop.removeEvent(this.ANIMATE_EVENT_KEY)

    for (const [index, circle] of this.circles.entries()) {
      const initial = this.initialPosition[index]
      circle.position = {...initial.position}
      circle.polarPosition = {...initial.polarPosition}
      circle.drawingPoint.position = {...initial.drawingPointPosition}
      circle.drawingPoint.polarPosition = {...initial.drawingPointPolarPosition}
    }

    this.resetPatternData()
  }
}
