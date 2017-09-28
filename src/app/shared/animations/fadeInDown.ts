import {animate, keyframes, style, transition, trigger} from '@angular/animations';

export function fadeInDown() {
  return trigger('fadeInDown', [
    transition('inactive => active', animate(1000, keyframes([
      style({opacity: '0', transform: 'translate3d(0, -100%, 0)'}),
      style({opacity: '1', transform: 'none'})
    ]))),
  ])
}
