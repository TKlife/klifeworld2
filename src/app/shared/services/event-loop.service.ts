import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { Point2d } from '../models/geometry/point-2d.model';

@Injectable({
  providedIn: 'root'
})
export class EventLoopService {
  frameRate = 30;
  mousePostition: Point2d = {x: 0, y: 0}
  events: {[key: string] : {params?: any[], function: (params?: any[]) => any, continous?: boolean}} = {}
  listenerCache: {[key: string] : {params?: any[], function: (params?: any[]) => any}} = {}
  paused = false

  constructor() {
    interval(1000 / this.frameRate).subscribe(() => {
      if (!this.paused) {
        this.doEvents()
      }
    })
  }

  doEvents(events?: {[key: string] : {params?: any[], function: (params?: any[]) => any}}) {
    if (!events) {
      events = this.events
    }
    const seen: string[] = []
    for (const key in this.events) {
      if (Object.prototype.hasOwnProperty.call(this.events, key)) {
        const event = this.events[key];
        event.function(event.params)
        if (!event.continous) {
          seen.push(key)
        }
      }
    }
    for (const event of seen) {
      delete this.events[event]
    }
  }

  addEvent(key: string, event: {params?: any[], function: (params?: any[]) => any}) {
    this.events[key] = event
  }

  removeEvent(key: string) {
    delete this.events[key]
  }

  fireEventNow(event: {params?: any[], function: (params?: any[]) => any}) {
    this.doEvents({'now': event})
  }

  addContinuous(key: string, event: {params?: any[], function: (params?: any[]) => any}) {
    this.events[key] = {...event, continous: true}
  }

  togglePause() {
    this.paused = !this.paused
  }
}
