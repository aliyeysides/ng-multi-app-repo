import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {HealthCheckService} from '../services/health-check.service';
import {PortfolioStatus} from '../shared/models/health-check';
import {isNullOrUndefined} from 'util';
import {Subscription} from 'rxjs/Subscription';

declare let gtag: Function;

@Component({
  selector: 'cpt-root',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
  template: `
    <!-- PANEL HEADER - Fixed to the top of each panel-->
    <span>
      <div class="page__header"
           [ngClass]="{'page__header--green': status?.avgPercentageChange>0, 'page__header--red': status?.avgPercentageChange<0}"
           id="page__header">
        <div #navBtn (click)="toggleNav()" class="header__button header__button--left" id="header_button--left">
          <img class="align-absolute" src="assets/imgs/icon_sandwich.svg">
        </div>
        <cpt-psp-settings-menu [btn]="navBtn" [navOpened]="navOpened"></cpt-psp-settings-menu>
        <div class="header__title header__search">
          <h1 *ngIf="!searchOpened">{{ title }}</h1>
          <cpt-psp-symbol-search [placeholder]="'Search'" *ngIf="searchOpened"></cpt-psp-symbol-search>
        </div>
        <div (click)="toggleSearch()" class="header__button header__button--right" id="header_button--right">
          <img class="align-absolute" src="assets/imgs/icon_psp_search.svg">
        </div>
      </div>
  
        <!-- App Container -->
      <div [ngBusy]="loading" class="container--main" id="container--main" [ngClass]="{'blur-me': searchOpened || ( navOpened | async ) }">
        <!-- PANEL ROUTER - Health Check, Insights, My Stocks -->
        <div class="router__container">
          <router-outlet></router-outlet>
        </div>
        <simple-notifications [options]="options"></simple-notifications>
      </div>
    </span>
  `
})
export class AppComponent {
  @ViewChild('search') search: ElementRef;

  public searchOpened: boolean = false;
  public navOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public title: string;
  public status: PortfolioStatus;
  public loading: Subscription;
  options = {
    position: ['top', 'right'],
    timeOut: 5000,
  };

  constructor(private router: Router, private healthCheck: HealthCheckService) {
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
    this.loading = this.healthCheck.getPortfolioStatus()
      .take(1)
      .subscribe(res => this.status = res);
  }

  toggleSearch() {
    this.searchOpened = !this.searchOpened;
  }

  toggleNav() {
    this.searchOpened = false;
    this.navOpened.next(!this.navOpened.getValue())
  }

}
