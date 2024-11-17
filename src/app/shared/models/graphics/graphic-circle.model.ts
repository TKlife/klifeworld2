import { Circle } from "../geometry/circle.model";
import { Point2d } from "../geometry/point-2d.model";
import { PolarPoint2d } from "../geometry/polar-point-2d.model";

export interface GraphicCircle extends Circle {
  position: Point2d
  polarPosition: PolarPoint2d
  
  strokeColor: string
  fillColor: string
  opacity: number
  lineWidth: number
  stroke?: boolean
  fill?: boolean
}