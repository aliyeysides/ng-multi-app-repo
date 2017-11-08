import {Component, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'cpt-root',
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- PANEL HEADER - Fixed to the top of each panel-->
    <div class="page__header">
      <div class="header__toggle">
        <img src="assets/imgs/icon_sandwich.svg">
      </div>
      <div class="header__title">
        <h1>Health Check</h1>
      </div>
      <div class="header__search">
        <img src="assets/imgs/icon_psp_search.svg">
      </div>
    </div>
    
    <!--<div class="navbar">-->
      <!--<div class="container&#45;&#45;nav">-->
        <!--<div class="logo">-->
          <!--<img src="assets/imgs/logo_powerpulse.svg">-->
        <!--</div>-->
        <!--<div class="nav-list">-->
          <!--<ul>-->
            <!--<li>-->
              <!--<a><i class="fa fa-tachometer" aria-hidden="true"></i> &nbsp;Health Check</a>-->
            <!--</li>-->
            <!--<li>-->
              <!--<a><i class="fa fa-list" aria-hidden="true"></i> &nbsp;My Stocks</a>-->
            <!--</li>-->
            <!--<li>-->
              <!--<a><i class="fa fa-heartbeat" aria-hidden="true"></i> &nbsp;Market Beat</a>-->
            <!--</li>-->
          <!--</ul>-->
          <!--<ul>-->
            <!--<li>-->
              <!--<a><i class="fa fa-cogs" aria-hidden="true"></i> &nbsp;Settings</a>-->
            <!--</li>-->
          <!--</ul>-->
          <!--<ul>-->
            <!--<li>-->
              <!--<a><i class="fa fa-user-times" aria-hidden="true"></i> &nbsp;Sign Out</a>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  options = {
    position: ['top', 'right'],
    timeOut: 5000,
  };

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // TODO: need new ga id for psp;
        // gtag('config', 'UA-109099815-2', {
        //   'page_location': 'https://app.chaikinanalytics.com/ideas/' + event.urlAfterRedirects,
        //   'page_path': event.urlAfterRedirects
        // });
      }
    });
  }

}
