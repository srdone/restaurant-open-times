import { Injectable } from '@angular/core';
import { RawHourValidator } from '../interfaces/raw-hour-validator.interface';
import { RawHours } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RawHourValidatorService implements RawHourValidator {

  // tslint:disable-next-line:max-line-length
  private RAW_TIME_REGEX = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun){1}(?:-(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun))?(?:, (?:Mon|Tue|Wed|Thu|Fri|Sat|Sun){1}(?:-(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun))?)? (?:[0-9][0-9]?){1}:?(?:[0-9][0-9]?)? (?:am|pm) - (?:[0-9][0-9]?){1}:?(?:[0-9][0-9]?)? (?:am|pm))$/;
  private DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  private DAY_GROUP_REGEX = /((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)-(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun))/g;

  constructor() {
    this.validate = this.validate.bind(this);
  }

  /**
   * Validates every raw hours object to make sure it has the proper structure
   * and that the times strings are properly formatted for the parser
   * @param rawHours - a raw hours object to validate
   */
  validate(rawHours: RawHours): boolean {
    // must have a name
    if (!rawHours.name) {
      return false;
    }

    for (const time of rawHours.times) {

      // must pass the general structure
      if (!this.RAW_TIME_REGEX.test(time)) {
        return false;
      }

      // must have only one occurence of a day
      for (const day of this.DAYS) {
        if (!time.includes(day)) {
          continue;
        }
        if (time.match(new RegExp(day, 'g')).length > 1) {
          return false;
        }
      }

      // must have only one day group (e.g. Mon-Fri) that must be in the correct order
      const dayGroups = time.match(this.DAY_GROUP_REGEX);
      if (!dayGroups) {
        continue;
      }
      if (dayGroups.length > 1) {
        return false;
      }
      const daysNumsInGroup = dayGroups[0].split('-').map(day => this.DAYS.indexOf(day));
      if (daysNumsInGroup[0] > daysNumsInGroup[1]) {
        return false;
      }
    }
    return true;
  }
}
