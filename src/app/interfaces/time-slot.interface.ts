export interface TimeSlot {
  weekday: number;
  start: {
    hour: number;
    minutes: number;
  };
  end: {
    hour: number;
    minutes: number;
  };
}
