import { Injectable } from '@angular/core';
import { RawHourParser, RawHours, TimeSlot, TimeBoundary } from '../interfaces';
import { ParsedHours } from '../interfaces/parsed-hours.interface';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RawHourParserService implements RawHourParser {

  private DAYS_REGEX = /((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun){1}-?(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)?(?:, (?:Mon|Tue|Wed|Thu|Fri|Sat|Sun))?)/;
  private DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  private TIME_REGEX = /((?:[0-9][0-9]?){1}:?(?:[0-9][0-9]?)? (?:am|pm) - (?:[0-9][0-9]?){1}:?(?:[0-9][0-9]?)? (?:am|pm))/;

  constructor() {
    this.parseTime = this.parseTime.bind(this);
    this.getDays = this.getDays.bind(this);
  }

  /**
   * Takes a raw hours object and converts it to a parsed hourse object
   * Assumes time strings have been validated
   * @param rawHours - raw hours object to parse
   */
  parse(rawHours: RawHours): ParsedHours {
    return {
      name: rawHours.name,
      times: _(rawHours.times).flatMap(this.parseTime).value(),
      rawTimes: rawHours.times
    };
  }

  /**
   * Takes a standard, validated raw time string and converts it to a time slot array
   * @param time - a string in the format Day-Day, Day HH:MM am/pm HH:MM am/pm
   */
  private parseTime(time: string): TimeSlot[] {
    return this.getDays(time)
      .map(weekday => {
        const t = this.TIME_REGEX.exec(time)[0];
        return {
          weekday,
          start: this.getStartTime(t),
          end: this.getEndTime(t)
        };
      });
  }

  /**
   * Takes a raw day and converts it into an array of days
   * Assumes data is already in correct format
   * @param time - a string in the format Day-Day or Day
   */
  private getDays(time: string): number[] {
    const days = [];
    let dayRanges: string[];
    let startDay, startDayIdx, endDay, endDayIdx;

    const daysRegexResult = this.DAYS_REGEX.exec(time)[0];

    if (daysRegexResult.includes(', ')) {
      dayRanges = daysRegexResult.split(', ');
    } else {
      dayRanges = [daysRegexResult];
    }

    return _(dayRanges)
      .flatMap((t) => {
        if (!t.includes('-')) {
          return [this.DAYS.indexOf(t) === 6 ? 0 : this.DAYS.indexOf(t) + 1];
        }

        [startDay, endDay] = t.split('-');
        startDayIdx = this.DAYS.indexOf(startDay);
        endDayIdx = this.DAYS.indexOf(endDay);

        for (let i = startDayIdx; i <= endDayIdx; i++) {
          days.push(i === 6 ? 0 : i + 1);
        }
        return days;
      })
      .value();
  }

  /**
   * Takes a time string and grabs the start time from it, returning a time boundary
   * Assumes time string is of the format HH(:MM)? am/pm - HH(:MM)? am/pm
   * @param time - a string with a time range (e.g. 11:30 am - 5 pm)
   */
  private getStartTime(time: string): TimeBoundary {
    const rawStart = time.split('-')[0].trim();
    return this.getTime(rawStart);
  }

  /**
   * Takes a time string and grabs the end time from it, returning a time boundary
   * Assumes time string is of the format HH(:MM)? am/pm - HH(:MM)? am/pm
   * @param time - a string with a time range (e.g. 11:30 am - 5 pm)
   */
  private getEndTime(time: string): TimeBoundary {
    const rawStart = time.split('-')[1].trim();
    return this.getTime(rawStart);
  }

  /**
   * Takes a time string of the specific format and converts it to a time boundary
   * Assumes time string is of the format: HH(:MM)? am/pm
   * @param time - a string with a time, limited to format: HH(:MM)? am/pm
   */
  private getTime(time: string): TimeBoundary {
    let hour = time.includes(':') ? +time.split(':')[0] : +time.split(' ')[0];
    const minute = time.includes(':') ? +time.split(':')[1].split(' ')[0] : 0;

    if (time.includes('pm')) {
      hour += 12;
    } else if (time.includes('am') && hour === 12) {
      hour = 0;
    }

    return { hour, minute };
  }
}
