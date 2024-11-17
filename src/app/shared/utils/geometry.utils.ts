import { Circle } from "../models/geometry/circle.model";
import { Point2d } from "../models/geometry/point-2d.model";

export class GeometryUtils {
  /**
   * Creat
   * @param x x coordinate
   * @param y y coordinate
   * @returns returns an {x, y} point object
   */
  static getPoint(x: number, y: number) {
    return {x, y};
  }

  /**
   * turns polar coordinates into cartesian coordanets relative to a normal cartesian plane
   * @param r radius
   * @param theta angle in radians
   * @returns cartesian point object
   */
  static getPointFromPolar(r: number, theta: number, offsetX = 0, offsetY = 0): Point2d {
    const x = r * Math.cos(theta) + offsetX;
    const y = r * Math.sin(theta) + offsetY;

    return {x, y}
  }

  /**
   * converts cartesian points to polar coordinates
   * @param point x and y coordinates
   * @returns polar coordinates
   */
  static getPolarFromPoint(point: Point2d) {
    const radius = Math.sqrt((Math.pow(point.x, 2) + Math.pow(point.y, 2)))
    let theta = Math.atan(point.y / point.x)
    const quadrent = this.getPointQuadrent(point)
    if (quadrent === 2 || quadrent === 3) {
      theta += Math.PI
    } else if (quadrent === 4) {
      theta += (Math.PI * 2)
    }

    console.log(theta * (180 / Math.PI))

    return {radius, theta }
  }

  static getPointQuadrent(point: Point2d) {
    if (point.x === 0) {
      if (point.y > 0) {
        return 1
      } else {
        return 4
      }
    }
    if (point.x > 0) {
      if (point.y >= 0) {
        return 1
      } else {
        return 4
      }
    } else {
      if (point.y >= 0) {
        return 2
      } else {
        return 3
      }
    }
  }

  static lengthOfLine(point1: Point2d, point2: Point2d) {
    return Math.sqrt((Math.pow(Math.abs(point1.x - point2.x), 2) + Math.pow(Math.abs(point1.y - point2.y), 2)))
  }

  static getTranslatedPoint(point: Point2d, offsetX: number, offsetY: number) {
    const newPoint = { ...point };
    return this.translatePoint(newPoint, offsetX, offsetY)
  }

  static translatePoint(point: Point2d, offsetX: number, offsetY: number) {
      point.x = point.x + offsetX,
      point.y = point.y + offsetY

      return point
  }

  static getCircumfrence(circle: Circle) {
    return circle.radius * Math.PI * 2
  }
}