import { TimeSlot } from './time-slot.interface';

export interface ParsedHours {
  name: string;
  times: TimeSlot[];
  rawTimes: string[];
}


