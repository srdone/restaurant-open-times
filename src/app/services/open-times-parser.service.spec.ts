import { TestBed } from '@angular/core/testing';

import { OpenTimesParserService } from './open-times-parser.service';

describe('OpenTimesParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenTimesParserService = TestBed.get(OpenTimesParserService);
    expect(service).toBeTruthy();
  });

  it('should have a parse method', () => {
    const service: OpenTimesParserService = TestBed.get(OpenTimesParserService);
    expect(service.parse).toEqual(jasmine.any(Function));
  });
});
