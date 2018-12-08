import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { RestaurantsService } from './services/restaurants.service';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { ParsedHours } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private selectDate$: BehaviorSubject<NgbDateStruct>;
  private selectTime$: BehaviorSubject<NgbTimeStruct>;

  selectedDate: NgbDateStruct;
  selectedTime: NgbTimeStruct;
  openRestaurants$: Observable<ParsedHours[]>;
  displayDate$: Observable<string>;

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
        map(([date, time]) => moment(new Date(date.year, date.month - 1, date.day, time.hour, time.minute)))
      );

    this.openRestaurants$ = selectedMoment
      .pipe(
        switchMap(time => this.restaurants.getOpenRestaurants$(time)),
      );

    this.displayDate$ = selectedMoment
        .pipe(
          map(time => time.format('dddd, MMMM Do YYYY, h:mm a'))
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
