import { TestBed } from '@angular/core/testing';

import { IsOpenService } from './is-open.service';
import * as moment from 'moment';

describe('IsOpenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsOpenService = TestBed.get(IsOpenService);
    expect(service).toBeTruthy();
  });

  describe('isOpen(testTime, openTimes)', () => {
    let service: IsOpenService;

    beforeEach(() => {
      service = TestBed.get(IsOpenService);
    });

    it('should return true if the current time is during one of the open times', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 3, 12, 30)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 21,
            minute: 0
          }
        }
      ]);

      expect(result).toBe(true);
    });

    it('should return true if the current time is at the very beginning of one of the open times', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 3, 11, 30)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 21,
            minute: 0
          }
        }
      ]);

      expect(result).toBe(true);
    });

    it('should return false if the current time is just before the very beginning of one of the open time', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 3, 11, 29)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 21,
            minute: 0
          }
        }
      ]);

      expect(result).toBe(false);
    });

    it('should return true if the current time is at the very end of one of the open times', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 3, 21, 0)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 21,
            minute: 0
          }
        }
      ]);

      expect(result).toBe(true);
    });

    it('should return true if the current time is on a day other than the first time listed but is still on one day', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 4, 21, 0)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 21,
            minute: 0
          }
        },
        {
          weekday: 2,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 21,
            minute: 0
          }
        }
      ]);

      expect(result).toBe(true);
    });

    it('should return false if the current time is just after the end of the open time', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 3, 21, 1)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 21,
            minute: 0
          }
        }
      ]);

      expect(result).toBe(false);
    });

    it('should return true if an open time extends to the next day and the testTime is on that day before the end of the open time', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 4, 0, 30)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 1,
            minute: 0
          }
        }
      ]);

      expect(result).toBe(true);
    });

    it('should return true if an open time extends to the next day and the testTime is on the current day after the start time', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 3, 11, 30)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 0
          },
          end: {
            hour: 1,
            minute: 0
          }
        }
      ]);

      expect(result).toBe(true);
    });

    it('should return true if an open time extends to the next day and the testTime is on that day at the end of the open time', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 4, 0, 30)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 0,
            minute: 30
          }
        }
      ]);

      expect(result).toBe(true);
    });

    it(`should return true if an open time extends to the next day and the testTime is on
    the next day before the end of the open time and the next day is a sunday`, () => {
      const result = service.isOpen(moment(new Date(2018, 11, 9, 0, 30)), [
        {
          weekday: 6,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 1,
            minute: 30
          }
        }
      ]);

      expect(result).toBe(true);
    });

    it(`should return false if an open time extends to the next day and the testTime
      is on that day just after the end of the open time`, () => {
      const result = service.isOpen(moment(new Date(2018, 11, 4, 0, 31)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 0,
            minute: 30
          }
        }
      ]);

      expect(result).toBe(false);
    });

    it('should return false if the current time is outside all of the open times', () => {
      const result = service.isOpen(moment(new Date(2018, 11, 3, 10, 30)), [
        {
          weekday: 1,
          start: {
            hour: 11,
            minute: 30
          },
          end: {
            hour: 21,
            minute: 0
          }
        },
        {
          weekday: 1,
          start: {
            hour: 9,
            minute: 30
          },
          end: {
            hour: 10,
            minute: 0
          }
        }
      ]);

      expect(result).toBe(false);
    });

  });
});
