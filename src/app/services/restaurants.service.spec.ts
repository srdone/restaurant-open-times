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
  });
});

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
