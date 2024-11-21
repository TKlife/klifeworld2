import { Subscription, interval } from "rxjs"

export class EventLoop {
  frameRate: number
  events: {[key: string] : {params?: any[], function: (params?: any[]) => any, continous?: boolean}} = {}
  paused = false
  loop!: Subscription

  constructor(frameRate: number) {
    this.frameRate = frameRate
  }

  async startEventLoop() {
    this.loop = interval(1000 / this.frameRate).subscribe(() => {
      if (!this.paused) {
        this.doEvents()
      }
    })
  }

  stopEventLoop() {
    this.loop.unsubscribe()
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

  changeFrameRate(frameRate?: number) {
    if (frameRate) {
      this.frameRate = frameRate
    }
    this.stopEventLoop()
    this.startEventLoop()
  }
}