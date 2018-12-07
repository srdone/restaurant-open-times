import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JsonRawHoursGetterService } from './json-raw-hours-getter.service';

describe('JsonRawHoursGetterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: JsonRawHoursGetterService = TestBed.get(JsonRawHoursGetterService);
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    let service: JsonRawHoursGetterService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      service = TestBed.get(JsonRawHoursGetterService);
      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should return an observable of raw hours', () => {
      const dummyHours = [
        {
          'name': 'Osakaya Restaurant',
          'times': ['Mon-Thu, Sun 11:30 am - 9 pm', 'Fri-Sat 11:30 am - 9:30 pm']
        },
        {
          'name': 'The Stinking Rose',
          'times': ['Mon-Thu, Sun 11:30 am - 10 pm', 'Fri-Sat 11:30 am - 11 pm']
        }
      ];

      service.get().subscribe(rawHours => {
        expect(rawHours.length).toBe(2);
        expect(rawHours).toEqual(dummyHours);
      });

      const req = httpMock.expectOne('assets/data/rest_hours.json');
      expect(req.request.method).toBe('GET');
      req.flush(dummyHours);
    });
  });

});
