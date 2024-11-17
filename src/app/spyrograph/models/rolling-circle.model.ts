import { PolarPoint2d } from '../../shared/models/geometry/polar-point-2d.model'
import { GraphicCircle } from '../../shared/models/graphics/graphic-circle.model'

export interface RollingCircle extends GraphicCircle {
  speed: number
  drawingPoint: GraphicCircle & {polarPosition: PolarPoint2d}
  show: boolean
  showDrawingPoint: boolean
}
