import {ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {HealthCheckService} from '../services/health-check.service';
import {PortfolioStatus} from '../shared/models/health-check';
import {Subject} from 'rxjs/Subject';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-root',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
  template: `
    <!-- PANEL HEADER - Fixed to the top of each panel-->
    <div class="page__header"
         [ngClass]="{'page__header--green': status?.avgPercentageChange>0, 'page__header--red': status?.avgPercentageChange<0}"
         id="page__header">
      <div #navBtn (click)="toggleNav()" class="header__button header__button--left" id="header_button--left">
        <img class="align-absolute" src="assets/imgs/icon_sandwich.svg">
      </div>
      <cpt-psp-settings-menu [btn]="navBtn" [navOpened]="navOpened"
                             (navClosed)="navOpened.next(false)"></cpt-psp-settings-menu>
      <div class="header__title header__search">
        <h1 *ngIf="!searchOpened">{{ title }}</h1>
        <cpt-psp-symbol-search [btn]="searchBtn" (toggleSearch)="toggleSearch()" [placeholder]="'Search'"
                               *ngIf="searchOpened"></cpt-psp-symbol-search>
      </div>
      <div #searchBtn (click)="toggleSearch();$event.stopPropagation()" class="header__button header__button--right" id="header_button--right">
        <img class="align-absolute" src="assets/imgs/icon_psp_search.svg">
      </div>
    </div>
    
    <div class="page__header--desktop">
      <div class="row no-gutters">
        <div class="col-2 logo--desktop">
          <img class="" src="assets/imgs/logo_powerpulse--desktop.png">
        </div>
        <div class="col-8">
          <cpt-psp-navigator *ngIf="!searchOpened"></cpt-psp-navigator>
          <!--<cpt-psp-symbol-search [btn]="searchBtn" (toggleSearch)="toggleSearch()" [placeholder]="'Search'"-->
                                 <!--*ngIf="searchOpened"></cpt-psp-symbol-search>-->
        </div>
        <div class="col-2">
          <div #searchBtn (click)="toggleSearch();$event.stopPropagation()"  class="header__button header__button--left" id="header_button--right">
            <img class="align-absolute" src="assets/imgs/icon_psp_search.svg">
          </div>
          <div class="header__button header__button--right">
        <img class="align-absolute" src="assets/imgs/icon_sandwich.svg">
      </div>
        </div>
      </div>
    </div>

    <!-- App Container -->
    <div class="container--main" id="container--main" [ngClass]="{'blur-me': searchOpened || navOpened.getValue()}">
      <!-- PANEL ROUTER - Health Check, Insights, My Stocks -->
      <div class="router__container">
        <router-outlet></router-outlet>
      </div>
      <simple-notifications [options]="options"></simple-notifications>
    </div>
  `
})
export class AppComponent implements OnDestroy {
  @ViewChild('navBtn') navBtn: ElementRef;
  @ViewChild('searchBtn') searchBtn: ElementRef;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  searchOpened: boolean = false;
  navOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  title: string;
  status: PortfolioStatus;

  options = {
    position: ['top', 'right'],
    timeOut: 5000
  };

  constructor(private router: Router,
              private cd: ChangeDetectorRef,
              private healthCheck: HealthCheckService) {
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
    this.healthCheck.getPortfolioStatus()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.status = res);

  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  toggleSearch() {
    this.searchOpened = !this.searchOpened;
    this.cd.detectChanges();
  }

  toggleNav() {
    this.searchOpened = false;
    this.navOpened.next(!this.navOpened.getValue())
  }

}
