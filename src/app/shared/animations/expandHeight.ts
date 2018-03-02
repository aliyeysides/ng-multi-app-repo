import {animate, state, style, transition, trigger} from '@angular/animations';

export function expandHeight() {
  return trigger('expandHeight', [
    state('closed', style({height: '0', opacity: '0'})),
    state('opened', style({height: '*'})),
    transition('closed => opened', animate(250)),
    transition('opened => closed', animate(250))
  ])
}
