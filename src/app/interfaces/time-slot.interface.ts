export interface TimeSlot {
  weekday: number;
  start: TimeBoundary;
  end: TimeBoundary;
}

export interface TimeBoundary {
  hour: number;
  minute: number;
}
