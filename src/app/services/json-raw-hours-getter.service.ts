import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RawHoursGetter } from '../interfaces/raw-hours-getter.interface';
import { Observable } from 'rxjs';
import { RawHours } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
// This follows a standard interface so the implementation could be changed out
// on the fly with a way to get the data from other sources, such as another server
export class JsonRawHoursGetterService implements RawHoursGetter {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Returns an observable that emits a list of raw hours retrieved from
   * the rest_hours.json in the assets folder.
   * Emits once and completes
   */
  get(): Observable<RawHours[]> {
    return this.http.get<RawHours[]>('assets/data/rest_hours.json');
  }
}
