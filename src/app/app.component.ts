import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { RestaurantsService } from './services/restaurants.service';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { ParsedHours } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  selectedDate: NgbDateStruct;
  selectedTime: NgbTimeStruct;
  openRestaurants$: Observable<ParsedHours[]>;
  displayDate$: Observable<{value?: string, error?: string}>;
  restaurantsError: string;

  private selectDate$: BehaviorSubject<NgbDateStruct>;
  private selectTime$: BehaviorSubject<NgbTimeStruct>;

  constructor(
    private restaurants: RestaurantsService
  ) {
  }

  ngOnInit() {
    const currentDate = moment();
    this.selectedDate = {
      year: currentDate.year(),
      month: currentDate.month() + 1,
      day: currentDate.date()
    };
    this.selectedTime = {
      hour: currentDate.hour(),
      minute: currentDate.minute(),
      second: currentDate.second()
    };

    // use behavior subjects to ensure the open restaurants stream has an initial set of values
    this.selectDate$ = new BehaviorSubject(this.selectedDate);
    this.selectTime$ = new BehaviorSubject(this.selectedTime);

    const selectedMoment = combineLatest(this.selectDate$, this.selectTime$)
      .pipe(
        map(([date, time]) => {
          if (!date || !time) {
            // no proper date/time selected, create invalid date for later error handling
            return moment.invalid();
          }
          return moment(new Date(date.year, date.month - 1, date.day, time.hour, time.minute));
        })
      );

    this.openRestaurants$ = selectedMoment
      .pipe(
        switchMap(time => {
          if (time.isValid()) {
            return this.restaurants.getOpenRestaurants$(time);
          }
          return of([]);
        }),
        catchError(err => {
          // generally, performing side effects in observables is bad practice
          // here it is saving us from having to handle unsubscribing manually
          // from the subscription because the async pipe handles that automatically
          // if we wanted to handle this in the catch callback of the subscription
          // we would have to subscribe and unsubscribe manually
          this.restaurantsError = err;
          return throwError(err);
        })
      );

    this.displayDate$ = selectedMoment
        .pipe(
          map(time => {
            if (time.isValid()) {
              return {
                value: time.format('dddd, MMMM Do YYYY [at] h:mm a')
              };
            }
            return { error: 'Invalid date or time selected. Please select a valid date and time.' };
          })
        );
  }

  ngOnDestroy() {
    // no need to unsubscribe here because the async pipe
    // handles subscribe and unsubscribe automatically
  }

  onDateSelect(date) {
    this.selectedDate = date;
    this.selectDate$.next(date);
  }

  onTimeSelect(time) {
    this.selectedTime = time;
    this.selectTime$.next(time);
  }
}
