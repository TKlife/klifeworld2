import { Point2d } from "../../shared/models/geometry/point-2d.model";
import { GeometryUtils } from "../../shared/utils/geometry.utils";
import { RollingCircle } from "../models/rolling-circle.model";

export class RollingCircleUtils {
  static getRollingCirclePosition(circle: RollingCircle): Point2d {
    return GeometryUtils.addPostions(circle.baseCircle.position, circle.position)
  }

  static getDrawingPointPosition(circle: RollingCircle) {
    const circlePosition = this.getRollingCirclePosition(circle)
    return GeometryUtils.addPostions(circlePosition, circle.drawingPoint.position)
  }

  static getBaseCircleRadius(circle: RollingCircle) {
    let radius = GeometryUtils.lengthOfLine(circle.baseCircle.position, this.getRollingCirclePosition(circle)) 
    if (circle.interior) {
      radius += circle.radius
    } else {
      radius -= circle.radius
    }

    return Math.abs(radius)
  }

  static getNewRollingCircle(center: Point2d): RollingCircle {
    const radius = 140
    const position = {x: 290, y: 0}
    const polarPosition = GeometryUtils.getPolarFromPoint({x: position.x, y: position.y})
    const baseCirclePosition = center
    const baseCircleRadius = position.x + radius
    const drawerPosition = { x: 70, y: 0 }
    const drawerPolarPosition = GeometryUtils.getPolarFromPoint(drawerPosition)
    return {
      name: 'Circle 1',
      radius,
      position,
      polarPosition,
      deltaTheta: .05,
      deltaByBase: true,
      frameRate: 30,
      strokeColor: '#FF0000',
      fillColor: '#FF0000',
      opacity: 1,
      lineWidth: 1,
      patterColor: '#FF9911',
      patterLineWidth: 1,
      drawingPoint: {
        radius: 5,
        position: drawerPosition,
        polarPosition: drawerPolarPosition,
        opacity: 1,
        lineWidth: 1,
        strokeColor: '#FF9911',
        fillColor: '#FF9911',
        stroke: false,
        fill: true,
      },
      baseCircle: {
        radius: baseCircleRadius,
        position: baseCirclePosition,
        polarPosition: {radius: 0, theta: 0}, 
        opacity: 1,
        lineWidth: 1,
        strokeColor: '#009988',
        fillColor: '#009988',
        stroke: false,
        fill: true,
      },
      interior: true,
      stroke: false,
      fill: false,
      draw: true
    }
  }
}