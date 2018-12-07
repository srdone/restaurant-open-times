import { Injectable } from '@angular/core';
import { RawHourParser, RawHours } from '../interfaces';
import { ParsedHours } from '../interfaces/parsed-hours.interface';

@Injectable({
  providedIn: 'root'
})
export class RawHourParserService implements RawHourParser {

  constructor() { }

  parse(rawHours: RawHours): ParsedHours {
    return null;
  }
}
