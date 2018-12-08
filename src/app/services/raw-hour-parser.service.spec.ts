import { TestBed } from '@angular/core/testing';

import { RawHourParserService } from './raw-hour-parser.service';

describe('RawHourParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RawHourParserService = TestBed.get(RawHourParserService);
    expect(service).toBeTruthy();
  });

  it('should have a parse method', () => {
    const service: RawHourParserService = TestBed.get(RawHourParserService);
    expect(service.parse).toEqual(jasmine.any(Function));
  });

  describe('parse(rawHour)', () => {
    let service: RawHourParserService;

    beforeEach(() => {
      service = TestBed.get(RawHourParserService);
    });

    it('should parse a single day and timeslot', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon 11:30 am - 9 pm']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
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
        ],
        rawTimes: ['Mon 11:30 am - 9 pm']
      });
    });

    it('should parse a timeslot with only hours', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon 11 am - 9 pm']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
          {
            weekday: 1,
            start: {
              hour: 11,
              minute: 0
            },
            end: {
              hour: 21,
              minute: 0
            }
          }
        ],
        rawTimes: ['Mon 11 am - 9 pm']
      });
    });

    it('should parse a timeslot with minutes at both times', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon 11:11 am - 9:09 pm']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
          {
            weekday: 1,
            start: {
              hour: 11,
              minute: 11
            },
            end: {
              hour: 21,
              minute: 9
            }
          }
        ],
        rawTimes: ['Mon 11:11 am - 9:09 pm']
      });
    });

    it('should parse a timeslot that is only in the am', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon 8:11 am - 9:09 am']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
          {
            weekday: 1,
            start: {
              hour: 8,
              minute: 11
            },
            end: {
              hour: 9,
              minute: 9
            }
          }
        ],
        rawTimes: ['Mon 8:11 am - 9:09 am']
      });
    });

    it('should parse a timeslot with Sunday at the end in a day range', () => {
      const result = service.parse({
        name: 'Bombay Indian Restaurant',
        times: ['Mon-Sun 11:30 am - 10:30 pm']
      });

      expect(result).toEqual(jasmine.objectContaining({
        name: 'Bombay Indian Restaurant',
        times: [
          {
            weekday: 1,
            start: {
              hour: 11,
              minute: 30
            },
            end: {
              hour: 22,
              minute: 30
            }
          },
          {
            weekday: 2,
            start: {
              hour: 11,
              minute: 30
            },
            end: {
              hour: 22,
              minute: 30
            }
          },
          {
            weekday: 3,
            start: {
              hour: 11,
              minute: 30
            },
            end: {
              hour: 22,
              minute: 30
            }
          },
          {
            weekday: 4,
            start: {
              hour: 11,
              minute: 30
            },
            end: {
              hour: 22,
              minute: 30
            }
          },
          {
            weekday: 5,
            start: {
              hour: 11,
              minute: 30
            },
            end: {
              hour: 22,
              minute: 30
            }
          },
          {
            weekday: 6,
            start: {
              hour: 11,
              minute: 30
            },
            end: {
              hour: 22,
              minute: 30
            }
          },
          {
            weekday: 0,
            start: {
              hour: 11,
              minute: 30
            },
            end: {
              hour: 22,
              minute: 30
            }
          }
        ]
      }));
    });

    it('should parse a timeslot that is only at the beginning of the day', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon 12:00 am - 9:09 am']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
          {
            weekday: 1,
            start: {
              hour: 0,
              minute: 0
            },
            end: {
              hour: 9,
              minute: 9
            }
          }
        ],
        rawTimes: ['Mon 12:00 am - 9:09 am']
      });
    });

    it('should parse a timeslot that is near the end of the day', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon 12:00 am - 11:59 pm']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
          {
            weekday: 1,
            start: {
              hour: 0,
              minute: 0
            },
            end: {
              hour: 23,
              minute: 59
            }
          }
        ],
        rawTimes: ['Mon 12:00 am - 11:59 pm']
      });
    });

    it('should parse a timeslot that is at the end of the day', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon 12:00 am - 12:00 am']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
          {
            weekday: 1,
            start: {
              hour: 0,
              minute: 0
            },
            end: {
              hour: 0,
              minute: 0
            }
          }
        ],
        rawTimes: ['Mon 12:00 am - 12:00 am']
      });
    });

    it('should parse a timeslot that flows into the next day', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon 2 am - 1 am']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
          {
            weekday: 1,
            start: {
              hour: 2,
              minute: 0
            },
            end: {
              hour: 1,
              minute: 0
            }
          }
        ],
        rawTimes: ['Mon 2 am - 1 am']
      });
    });

    it('should parse multiple days and timeslot', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon-Fri 11:30 am - 9 pm']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
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
          },
          {
            weekday: 3,
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
            weekday: 4,
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
            weekday: 5,
            start: {
              hour: 11,
              minute: 30
            },
            end: {
              hour: 21,
              minute: 0
            }
          }
        ],
        rawTimes: ['Mon-Fri 11:30 am - 9 pm']
      });
    });

    it('should parse multiple days, including a non-contiguous day and timeslot', () => {
      const result = service.parse({
        name: 'A Test Restaurant',
        times: ['Mon-Tue, Sat 11:30 am - 9 pm']
      });

      expect(result).toEqual({
        name: 'A Test Restaurant',
        times: [
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
          },
          {
            weekday: 6,
            start: {
              hour: 11,
              minute: 30
            },
            end: {
              hour: 21,
              minute: 0
            }
          }
        ],
        rawTimes: ['Mon-Tue, Sat 11:30 am - 9 pm']
      });
    });

  });
});
