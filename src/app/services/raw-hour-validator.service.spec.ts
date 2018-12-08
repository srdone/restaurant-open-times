import { TestBed } from '@angular/core/testing';

import { RawHourValidatorService } from './raw-hour-validator.service';

describe('RawHourValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RawHourValidatorService = TestBed.get(RawHourValidatorService);
    expect(service).toBeTruthy();
  });

  describe('validate(rawHours: RawHours)', () => {
    let service: RawHourValidatorService;

    beforeEach(() => {
      service = TestBed.get(RawHourValidatorService);
    });

    it('should return true if it is a valid raw hour object', () => {
      let result: boolean;

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon-Thu, Sun 11:30 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      });

      expect(result).toBe(true);

      result = service.validate({
        name: 'Bombay Indian Restaurant',
        times: ['Mon-Sun 11:30 am - 10:30 pm']
      });

      expect(result).toBe(true);

      result = service.validate({
        name: 'A-1 Cafe Restaurant',
        times: ['Mon, Wed-Sun 11 am - 10 pm']
      });

      expect(result).toBe(true);

      result = service.validate({
        name: 'Cesario\'s',
        times: ['Mon-Thu, Sun 11:30 am - 10 pm', 'Fri-Sat 11:30 am - 10:30 pm']
      });

      expect(result).toBe(true);
    });

    it('should return false if it is missing a name', () => {
      const result = service.validate({
        times: ['Mon-Thu, Sun 11:30 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);
    });

    it('should return false if a time is malformed', () => {
      let result: boolean;

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon-, Sun 11:30 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['MonFri, Sun 11:30 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Monday 11:30 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon 11am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon 11 am- 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon 11 am - 9pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon 11 am -9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon-Mon 11 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon-Tue, Mon 11 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon-Sun 11 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon, Mon 11 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon-Tue, Wed-Fri 11 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);

      result = service.validate({
        name: 'Osakaya Restaurant',
        times: ['Mon-Tue 11 am - 9 pm Fri-Sat 11:30 am - 9:30 pm', 'Fri-Sat 11:30 am - 9:30 pm']
      } as any);

      expect(result).toBe(false);
    });
  });
});
