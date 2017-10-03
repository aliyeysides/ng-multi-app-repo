import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cpt-bear-navigator',
  template: `
    <div class="side-nav">
      <div class="side-nav__rule">
        <p>&ndash;&ndash;&ndash;&nbsp; NAVIGATION
          &nbsp;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;</p>
      </div>
      <ul class="side-nav__section">
        <li *ngFor="let route of routes"
            routerLinkActive="active"
            routerLink="{{ route.link }}">
          <a>
            <img src="{{ route.icon }}">
            <span class="text">{{ route.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./bear-navigator.component.scss']
})
export class BearNavigatorComponent implements OnInit {

  public routes = [
    {link: '/dashboard', icon: './assets/imgs/icon_home.svg', label: 'Home'},
    {link: '/ideas', icon: './assets/imgs/icon_bulb.svg', label: 'Stock Ideas'},
    {link: '/discovery', icon: './assets/imgs/icon_discovery.svg', label: 'Discovery'},
    {link: '/report', icon: './assets/imgs/icon_stockview.svg', label: 'Stock View'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
