import {animate, keyframes, style, transition, trigger} from '@angular/animations';

export function fadeIn() {
  return trigger('fadeIn', [
    transition('inactive => active', animate(1000, keyframes([
      style({opacity: '0'}),
      style({opacity: '1'})
    ]))),
  ])
}
