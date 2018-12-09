import { TestBed, async } from '@angular/core/testing';

import { RestaurantsService } from './restaurants.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';

describe('RestaurantsService integration tests', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: RestaurantsService = TestBed.get(RestaurantsService);
    expect(service).toBeTruthy();
  });

  describe('getOpenRestaurants$(time: Moment)', () => {
    let service: RestaurantsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      service = TestBed.get(RestaurantsService);
      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should emit a list of open restaurants given the time passed in', async(() => {
      const testTime = moment(new Date(2018, 11, 3, 11, 0));

      service.getOpenRestaurants$(testTime).subscribe(openRestaurants => {
        expect(openRestaurants.length).toBe(7);
        expect(openRestaurants.map(r => r.name)).toEqual([
          'Thai Stick Restaurant',
          'Sabella & La Torre',
          'Tong Palace',
          'India Garden Restaurant',
          'Sapporo-Ya Japanese Restaurant',
          'Santorini\'s Mediterranean Cuisine',
          'Kyoto Sushi'
        ]);
      });

      const req = httpMock.expectOne('assets/data/rest_hours.json');
      expect(req.request.method).toBe('GET');
      req.flush(allRestaurantData);
    }));

    it('should emit a list of open restaurants given the time passed in on a different day', async(() => {
      const testTime = moment(new Date(2018, 11, 4, 11, 0));

      service.getOpenRestaurants$(testTime).subscribe(openRestaurants => {
        expect(openRestaurants.length).toBe(7);
        expect(openRestaurants.map(r => r.name)).toEqual([
          'Thai Stick Restaurant',
          'Sabella & La Torre',
          'Tong Palace',
          'India Garden Restaurant',
          'Sapporo-Ya Japanese Restaurant',
          'Santorini\'s Mediterranean Cuisine',
          'Kyoto Sushi'
        ]);
      });

      const req = httpMock.expectOne('assets/data/rest_hours.json');
      expect(req.request.method).toBe('GET');
      req.flush(allRestaurantData);
    }));

    it('should emit the restaurants that are open from Saturday into early Sunday morning', () => {
      const testTime = moment(new Date(2018, 11, 9, 0, 30));

      service.getOpenRestaurants$(testTime).subscribe(openRestaurants => {
        expect(openRestaurants.length).toBe(2);
        expect(openRestaurants.map(r => r.name)).toEqual([
          'Sudachi',
          'Sabella & La Torre'
        ]);
      });

      const req = httpMock.expectOne('assets/data/rest_hours.json');
      expect(req.request.method).toBe('GET');
      req.flush(includingRestaurantsOpenIntoSundayMorning);
    });

    it('should emit an error if there is an improperly formatted value retrieved', () => {
      const testTime = moment(new Date(2018, 11, 3, 11, 0));

      service.getOpenRestaurants$(testTime).subscribe(
        () => {},
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual('Invalid data structure: {"name":"Thai Stick Restaurant","times":["Mon- 11 am - 1 am"]}');
        }
      );

      const req = httpMock.expectOne('assets/data/rest_hours.json');
      expect(req.request.method).toBe('GET');
      req.flush(badRestaurantData);
    });
  });
});

const badRestaurantData = [
  {
    'name': 'Thai Stick Restaurant',
    'times': ['Mon- 11 am - 1 am']
  }
];

const includingRestaurantsOpenIntoSundayMorning = [
  {
    'name': 'Sudachi',
    'times': ['Mon-Wed 5 pm - 12:30 am', 'Thu-Fri 5 pm - 1:30 am', 'Sat 3 pm - 1:30 am', 'Sun 3 pm - 11:30 pm']
  },
  {
    'name': 'Sabella & La Torre',
    'times': ['Mon-Thu, Sun 10 am - 10:30 pm', 'Fri-Sat 10 am - 12:30 am']
  },
  {
    'name': 'Santorini\'s Mediterranean Cuisine',
    'times': ['Mon-Sun 8 am - 10:30 pm']
  },
];

const allRestaurantData = [
  {
    'name': 'Thai Stick Restaurant',
    'times': ['Mon-Sun 11 am - 1 am']
  },
  {
    'name': 'Cesario\'s',
    'times': ['Mon-Thu, Sun 11:30 am - 10 pm', 'Fri-Sat 11:30 am - 10:30 pm']
  },
  {
    'name': 'Colombini Italian Cafe Bistro',
    'times': ['Mon-Fri 12 pm - 10 pm', 'Sat-Sun 5 pm - 10 pm']
  },
  {
    'name': 'Sabella & La Torre',
    'times': ['Mon-Thu, Sun 10 am - 10:30 pm', 'Fri-Sat 10 am - 12:30 am']
  },
  {
    'name': 'Soluna Cafe and Lounge',
    'times': ['Mon-Fri 11:30 am - 10 pm', 'Sat 5 pm - 10 pm']
  },
  {
    'name': 'Tong Palace',
    'times': ['Mon-Fri 9 am - 9:30 pm', 'Sat-Sun 9 am - 10 pm']
  },
  {
    'name': 'India Garden Restaurant',
    'times': ['Mon-Sun 10 am - 11 pm']
  },
  {
    'name': 'Sapporo-Ya Japanese Restaurant',
    'times': ['Mon-Sat 11 am - 11 pm', 'Sun 11 am - 10:30 pm']
  },
  {
    'name': 'Santorini\'s Mediterranean Cuisine',
    'times': ['Mon-Sun 8 am - 10:30 pm']
  },
  {
    'name': 'Kyoto Sushi',
    'times': ['Mon-Thu 11 am - 10:30 pm', 'Fri 11 am - 11 pm', 'Sat 11:30 am - 11 pm', 'Sun 4:30 pm - 10:30 pm']
  },
  {
    'name': 'Marrakech Moroccan Restaurant',
    'times': ['Mon-Sun 5:30 pm - 2 am']
  }
];
