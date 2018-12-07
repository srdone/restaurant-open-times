import { RawHours } from './raw-hours.interface';
import { Observable } from 'rxjs';

export interface RawHoursGetter {
  get: () => Observable<RawHours[]>;
}
