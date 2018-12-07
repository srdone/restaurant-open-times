import { RawHours } from './raw-hours.interface';

export interface RawHourValidator {
  validate: (rawHours: RawHours) => boolean;
}
