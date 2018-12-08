import { Injectable, Inject } from '@angular/core';
import { Moment } from 'moment';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, reduce, filter } from 'rxjs/operators';
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
    @Inject(JsonRawHoursGetterService) private getter: RawHoursGetter,
    @Inject(RawHourValidatorService) private validator: RawHourValidator,
    @Inject(RawHourParserService) private parser: RawHourParser,
    private isOpen: IsOpenService
  ) { }
  getOpenRestaurants$(time: Moment): Observable<ParsedHours[]> {
    return this.getter.get()
      .pipe(
        switchMap(rawHours => from(rawHours)),
        map(rawHour => {
          if (!this.validator.validate(rawHour)) {
            throw new Error(`Invalid data structure: ${JSON.stringify(rawHour)}`);
          }
          return rawHour;
        }),
        map(rawHour => this.parser.parse(rawHour)),
        filter((parsedHour: ParsedHours) => this.isOpen.isOpen(time, parsedHour.times)),
        reduce((acc: ParsedHours[], cur: ParsedHours) => [...acc, cur], [])
      );
  }
}
