import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-psp-navigator',
  template: `
    <div class="nav-list">
      <ul>
        <li *ngFor="let route of routes"
            routerLinkActive="active"
            routerLink="{{ route.link }}">
          <a><i class="{{ route.klass }}" aria-hidden="true"></i> &nbsp;{{ route.label }}</a>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./psp-navigator.component.scss']
})
export class PspNavigatorComponent {
  public routes = [
    {link: '/health-check', klass: 'fa fa-tachometer', label: 'Health Check'},
    {link: '/my-stocks', klass: 'fa fa-list', label: 'My Stocks'},
    {link: '/market-beat', klass: 'fa fa-heartbeat', label: 'Market Beat'},
  ];
}
