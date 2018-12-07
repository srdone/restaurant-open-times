import { Injectable } from '@angular/core';

import { Moment } from 'moment';
import * as _ from 'lodash';

import { TimeSlot, TimeBoundary } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class IsOpenService {

  constructor() { }

  /**
   * Takes a testTime and a list of openTimes and returns whether or not the test time
   * is during at least one of the open times
   * @param testTime - the time to test against
   * @param openTimes - the list of open times to test the testTime agains
   */
  isOpen(testTime: Moment, openTimes: TimeSlot[]): boolean {
    const testWeekday = testTime.day();
    const testHour = testTime.hour();
    const testMinute = testTime.minute();

    for (let i = 0; i < openTimes.length; i++) {
      const openTime = openTimes[i];
      const { weekday, start, end } = openTimes[i];
      if (weekday === testWeekday) {
        if (testHour > start.hour && testHour < end.hour) {
          return true;
        }
        if (testHour > start.hour && testHour === end.hour) {
          return testMinute <= end.minute;
        }
        if (testHour === start.hour && testHour < end.hour) {
          return testMinute >= start.minute;
        }
        if (testHour === start.hour && testHour === end.hour) {
          return testMinute >= start.minute && testMinute <= end.minute;
        }
      }
      if (this.flowsIntoNextDay(openTime) && (weekday + 1) === testWeekday) {
        if (testHour < end.hour) {
          return true;
        }
        if (testHour === end.hour) {
          return testMinute <= end.minute;
        }
      }
      return false;
    }
  }

  /**
   * Takes a time slot and returns whether or not the time extends into the next day
   * @param timeSlot - the timeslot to test if it extends to the next day
   */
  private flowsIntoNextDay({start, end}: TimeSlot): boolean {
    if (start.hour < end.hour) {
      return false;
    }
    if (start.hour === end.hour && start.minute < end.minute) {
      return false;
    }
    return true;
  }
}
