import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'cpt-root',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
  template: `
    <!-- PANEL HEADER - Fixed to the top of each panel-->
    <div class="page__header" id="page__header">
      <cpt-psp-settings-menu></cpt-psp-settings-menu>
      <div class="header__title">
        <h1 *ngIf="!globalSearch">{{ title }}</h1>
        <cpt-symbol-search *ngIf="globalSearch"></cpt-symbol-search>
      </div>
      <cpt-psp-search (toggleSearchClicked)="toggleSearch()"></cpt-psp-search>
    </div>

    <!-- App Container -->
    <div class="container--main" id="container--main">
      <!-- PANEL ROUTER - Health Check, Insights, My Stocks -->
      <div class="container--page">
        <router-outlet></router-outlet>
      </div>
      <simple-notifications [options]="options"></simple-notifications>
    </div>
  `
})
export class AppComponent {
  @ViewChild('search') search: ElementRef;

  public globalSearch: boolean = false;
  public title: string;
  options = {
    position: ['top', 'right'],
    timeOut: 5000,
  };

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.title = event.urlAfterRedirects.replace(/\W/g, ' ').trim().split(' ')
          .map(str => {
            let cap = str.charAt(0).toUpperCase();
            return cap + str.slice(1);
          }).join(' ');
        // TODO: need new ga id for psp;
        // gtag('config', 'UA-109099815-2', {
        //   'page_location': 'https://app.chaikinanalytics.com/ideas/' + event.urlAfterRedirects,
        //   'page_path': event.urlAfterRedirects
        // });
      }
    });
  }

  toggleSearch() {
    this.globalSearch = !this.globalSearch;
    console.log('I changed value of globalSearch', this.globalSearch);
  }

}
