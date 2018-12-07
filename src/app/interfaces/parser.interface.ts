import { RawRestaurantHours } from './raw-restaurant-hours.interface';
import { RestaurantHours } from './restaurant-hours.interface';

export interface Parser {
  parse: (rawHours: RawRestaurantHours) => RestaurantHours;
}
