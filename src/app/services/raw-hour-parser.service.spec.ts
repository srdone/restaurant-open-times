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
});
