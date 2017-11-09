import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-psp-navigator',
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
            <span class="text">{{ route.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./psp-navigator.component.scss']
})
export class PspNavigatorComponent {
  public routes = [
    {link: '/health-check', icon: './assets/imgs/icon_home.svg', label: 'Health Check'},
    {link: '/my-stocks', icon: './assets/imgs/icon_bulb.svg', label: 'My Stocks'},
    {link: '/market-beat', icon: './assets/imgs/icon_discovery.svg', label: 'Market Beat'},
  ];
}
