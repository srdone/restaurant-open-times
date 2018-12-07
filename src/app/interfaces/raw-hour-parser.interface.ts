import { RawHours } from './raw-hours.interface';
import { ParsedHours } from './parsed-hours.interface';

export interface RawHourParser {
  parse: (rawHours: RawHours) => ParsedHours;
}
