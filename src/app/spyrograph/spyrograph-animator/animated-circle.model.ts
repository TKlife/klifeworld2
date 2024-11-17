import { Circle } from "../../shared/models/geometry/circle.model";
import { GraphicCircle } from "../../shared/models/graphics/graphic-circle.model";
import { RollingCircle } from "../models/rolling-circle.model";

export interface AnimatedCircle extends RollingCircle {
  totalDistance: number
  rotation: number
  baseCircle: Circle
  interior: boolean
} 