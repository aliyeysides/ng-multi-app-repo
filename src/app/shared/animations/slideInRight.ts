import {animate, keyframes, style, transition, trigger} from '@angular/animations';

export function slideInRight() {
  return trigger('slideInRight', [
    transition('inactive => active', animate(250, keyframes([
      style({visibility: 'visible', transform: 'translate3d(100%, 0, 0)'}),
      style({transform: 'translate3d(0,0,0)'})
    ]))),
  ])
}
