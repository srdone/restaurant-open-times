import { TestBed } from '@angular/core/testing';

import { RawHourValidatorService } from './raw-hour-validator.service';

describe('RawHourValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RawHourValidatorService = TestBed.get(RawHourValidatorService);
    expect(service).toBeTruthy();
  });
});
