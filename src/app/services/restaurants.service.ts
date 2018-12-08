import { Injectable, Inject } from '@angular/core';
import { Moment } from 'moment';
import { Observable, from, throwError, of } from 'rxjs';
import { map, switchMap, reduce, filter, flatMap } from 'rxjs/operators';
import { RawHourValidatorService } from './raw-hour-validator.service';
import { RawHourParserService } from './raw-hour-parser.service';
import { JsonRawHoursGetterService } from './json-raw-hours-getter.service';
import { RawHourParser, RawHoursGetter, RawHourValidator, ParsedHours } from '../interfaces';
import { IsOpenService } from './is-open.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  constructor(
    // Using the interface type on the injections below to show how it could be used
    // if one wished to change out implementations under the hood
    // without using Angular's override feature in their DI Container:
    // { provide: SomeClass, useClass: SomeOverridingClass }
    @Inject(JsonRawHoursGetterService) private getter: RawHoursGetter,
    @Inject(RawHourValidatorService) private validator: RawHourValidator,
    @Inject(RawHourParserService) private parser: RawHourParser,
    private isOpen: IsOpenService
  ) {
    this.getOpenRestaurants$ = this.getOpenRestaurants$.bind(this);
  }

  /**
   * Returns an observable that emits a single array of restaurants with open hours
   * @param time - the time to check for open restaurants
   */
  getOpenRestaurants$(time: Moment): Observable<ParsedHours[]> {
    return this.getter.get()
      .pipe(
        switchMap(rawHours => from(rawHours)),
        flatMap(rawHour => {
          if (!this.validator.validate(rawHour)) {
            return throwError(`Invalid data structure: ${JSON.stringify(rawHour)}`);
          }
          return of(rawHour);
        }),
        map(rawHour => this.parser.parse(rawHour)),
        filter((parsedHour: ParsedHours) => this.isOpen.isOpen(time, parsedHour.times)),
        reduce((acc: ParsedHours[], cur: ParsedHours) => [...acc, cur], [])
      );
  }
}
