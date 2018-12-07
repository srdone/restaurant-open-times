import { Injectable } from '@angular/core';
import { Parser, RawRestaurantHours } from '../interfaces';
import { RestaurantHours } from '../interfaces/restaurant-hours.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenTimesParserService implements Parser {

  constructor() { }

  parse(rawHours: RawRestaurantHours): RestaurantHours {
    return null;
  }
}
