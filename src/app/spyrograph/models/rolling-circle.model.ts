import { Circle } from '../../shared/models/geometry/circle.model'
import { PolarPoint2d } from '../../shared/models/geometry/polar-point-2d.model'
import { GraphicCircle } from '../../shared/models/graphics/graphic-circle.model'

export interface RollingCircle extends GraphicCircle {
  name: string
  deltaTheta: number
  deltaByBase: boolean
  frameRate: number
  drawingPoint: GraphicCircle
  baseCircle: GraphicCircle
  interior: boolean
  patterColor: string
  patterLineWidth: number
  draw: boolean
}
