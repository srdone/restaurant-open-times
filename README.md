# RestaurantOpenTimes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.2.

## Important Notes

### Description

This project takes raw time slots representing open restaurant times in a specific
string format, parses them and tests to see which restaurants are open given any
date and time specified. A number of edge cases had to be considered:

* Some time slots include hours from the following day. For example, a restaurant may
open on Saturday at 3pm and close on Sunday at 1:30 am
* How to handle overflowing time slots (see above) that flowed from the last to the first
day of the week
* How to handle parsing the specific date format, which had some irregularities including:
  * Most slots had multiple days listed for the same time range, with a range of days and possibly one more day separated by a comma
  * Some hours not including minutes
  * Some time slots starting on the listed day and ending the following morning
* How to ensure that all of the data was valid before it passed through the parsing engine. Each time slot had to:
  * Include a week day only once
  * Never have a day span starting at the end of a week and ending in the next week
  * Follow a specific time format which could exclude minutes but had to specify am/pm

#### Responsiveness

This project has basic responsiveness built in - it should display fine on both desktops and phones, including
momentum scrolling on iPhone.

#### Colors

I'm clearly not a designer - I've overridden scss color defaults in bootstrap as an example of how to do it,
not an example of my ability to choose colors :)

### Live Project

A live version of this project is available on [github pages](https://srdone.github.io/restaurant-open-times).

To publish an updated version run `yarn deploy`

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
