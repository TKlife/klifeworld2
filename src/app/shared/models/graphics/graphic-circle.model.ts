import { Circle } from "../geometry/circle.model";
import { Point2d } from "../geometry/point-2d.model";

export interface GraphicCircle extends Circle {
  position: Point2d
  
  strokeColor: string
  fillColor: string
  opacity: number
  lineWidth: number
  stroke?: boolean
  fill?: boolean
}