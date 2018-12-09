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
    return openTimes.some(t => this.testOpenTime(testTime, t));
  }

  /**
   * Takes a test time and an open time and returns whether the test time
   * occurs during the open time
   * @param testTime - the time to see if the open time includes
   * @param openTime - the open time to test against
   */
  private testOpenTime(testTime: Moment, openTime: TimeSlot): boolean {
    const testWeekday = testTime.day();
    const testHour = testTime.hour();
    const testMinute = testTime.minute();

    const { weekday, start, end } = openTime;
    // account for all cases where the time slot being tested
    // is on the same weekday as the time being tested
    // and the time slot does not flow into the next day
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
    // account for cases where there is no end time during the same day
    // because the time slot flows into the next day
    if (this.flowsIntoNextDay(openTime) && weekday === testWeekday) {
      if (testHour > start.hour) {
        return true;
      }
      if (testHour === start.hour) {
        return testMinute >= start.minute;
      }
    }
    // account for cases where the time being tested is on the day after the
    // current time slot being compared but the current time slot includes time
    // from the day after the current time slot
    if (this.flowsIntoNextDay(openTime) && ((weekday + 1) === testWeekday)) {
      if (testHour < end.hour) {
        return true;
      }
      if (testHour === end.hour) {
        return testMinute <= end.minute;
      }
    }
    // account for cases where the time being tested is on Sunday and the
    // current time slot being compared is on Saturday but includes time from
    // Sunday because it flows into the day after the day listed in the time slot
    if (this.flowsIntoNextDay(openTime) && (weekday + 1 === 7) && (testWeekday === 0)) {
      if (testHour < end.hour) {
        return true;
      }
      if (testHour === end.hour) {
        return testMinute <= end.minute;
      }
    }
    return false;
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
