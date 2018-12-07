import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RawHoursGetter } from '../interfaces/raw-hours-getter.interface';
import { Observable } from 'rxjs';
import { RawHours } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class JsonRawHoursGetterService implements RawHoursGetter {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<RawHours[]> {
    return this.http.get<RawHours[]>('assets/data/rest_hours.json');
  }
}
