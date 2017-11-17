import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-psp-navigator',
  template: `
    <div class="nav-list">
      <ul>
        <li>
          <a><i class="fa fa-tachometer" aria-hidden="true"></i> &nbsp;Health Check</a>
        </li>
        <li>
          <a><i class="fa fa-list" aria-hidden="true"></i> &nbsp;My Stocks</a>
        </li>
        <li>
          <a><i class="fa fa-heartbeat" aria-hidden="true"></i> &nbsp;Market Beat</a>
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
