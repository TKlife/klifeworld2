import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  Signal,
  signal,
  viewChild,
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
import { EventLoopService } from '../shared/services/event-loop.service'
import { RollingCircleUtils } from './util/rolling-circle.util'

@Component({
  selector: 'klife-spyrograph',
  standalone: true,
  imports: [SpyrographParamEditorComponent, SpyrographAnimatorComponent, CommonModule],
  templateUrl: './spyrograph.component.html',
  styleUrl: './spyrograph.component.scss',
})
export class SpyrographComponent {
  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>

  @ViewChild('animator')
  animator!: SpyrographAnimatorComponent

  eventLoop = inject(EventLoopService)

  dimentions: WritableSignal<Dimentions2d> = signal({ height: 0, width: 0 })
  center: Signal<Point2d> = computed(() => {
    return {
      x: this.dimentions().width / 2,
      y: this.dimentions().height / 2,
    }
  })
  rollingCircles: RollingCircle[] = []
  startedAnimation = false

  ngOnInit() {
    this.resize()
    const circle = this.createRollingCircle()
    circle.drawingPoint.position = GeometryUtils.getPointFromPolar(circle.drawingPoint.polarPosition.radius, circle.drawingPoint.polarPosition.theta)
    this.rollingCircles.push(circle)
  }

  @HostListener('window:resize', ['event'])
  resize() {
    this.dimentions.set({
      height: this.container.nativeElement.clientHeight,
      width: this.container.nativeElement.clientWidth,
    })
  }

  startAnimation() {
    this.startedAnimation = true
  }

  reset() {
    this.animator.reset()
    this.startedAnimation = false
  }

  createRollingCircle(): RollingCircle {
    return RollingCircleUtils.getNewRollingCircle({...this.center()})
  }
}
