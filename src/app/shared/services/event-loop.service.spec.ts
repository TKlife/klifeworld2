import { TestBed } from '@angular/core/testing';

import { EventLoopService } from './event-loop.service';

describe('EventLoopService', () => {
  let service: EventLoopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventLoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
