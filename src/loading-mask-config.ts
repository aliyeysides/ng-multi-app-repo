import {BusyConfig} from 'angular2-busy';

export const loadingMaskConfig: BusyConfig = ({
  message: '',
  backdrop: true,
  delay: 0,
  minDuration: 0,
  template: `<div class="spinner">
  <div class="rect1"></div>
  <div class="rect2"></div>
  <div class="rect3"></div>
  <div class="rect4"></div>
  <div class="rect5"></div>
  </div>`,
  wrapperClass: 'ng-busy'
});

export const loadingMaskConfig2: BusyConfig = ({
  message: '',
  backdrop: true,
  delay: 0,
  minDuration: 0,
  template: `<div class="sk-folding-cube">
  <div class="sk-cube1 sk-cube"></div>
  <div class="sk-cube2 sk-cube"></div>
  <div class="sk-cube4 sk-cube"></div>
  <div class="sk-cube3 sk-cube"></div>
</div>`,
  wrapperClass: 'ng-busy'
});

export const loadingMaskConfig3: BusyConfig = ({
  message: '',
  backdrop: true,
  delay: 0,
  minDuration: 0,
  template: `<div class="spinner"></div>`,
  wrapperClass: 'ng-busy'
});
