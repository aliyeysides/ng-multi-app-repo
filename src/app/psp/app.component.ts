import {
  ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {HealthCheckService} from '../services/health-check.service';
import {PortfolioStatus} from '../shared/models/health-check';
import {Subject} from 'rxjs/Subject';
import {PspOnboardingComponent} from './core/psp-onboarding/psp-onboarding.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

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
         
      <div #navBtn (click)="toggleNav();$event.stopPropagation()" class="header__button header__button--left" id="header_button--left">
        <img class="align-absolute" src="assets/imgs/icon_sandwich.svg">
      </div>

      <cpt-psp-settings-menu [side]="menuPosition" [btn]="navBtn" [navOpened]="navOpened"
                             (navClosed)="navOpened.next(false)"></cpt-psp-settings-menu>

      <div class="header__title header__search">
        <h1 *ngIf="!searchOpened">{{ title }}</h1>
        <cpt-psp-symbol-search [btn]="searchBtn" (toggleSearch)="toggleSearch()" [placeholder]="'Search'"
                               *ngIf="searchOpened"></cpt-psp-symbol-search>
      </div>

      <div #searchBtn (click)="toggleSearch();$event.stopPropagation()" class="header__button header__button--right"
           id="header_button--right">
        <img class="align-absolute" src="assets/imgs/icon_psp_search.svg">
      </div>
    </div>

    <div class="page__header--desktop">
      <div class="row">
        <cpt-market-summary></cpt-market-summary>
      </div>
      <div class="row no-gutters">
        <div class="col-2 col-lg-3 logo--desktop">
          <img src="assets/imgs/logo_powerpulse.svg">
        </div>
        <div class="col-8 col-lg-7 col-xl-6 header__search" >
          <cpt-psp-navigator *ngIf="!searchOpened" class="desktop-nav" id="desktop-nav__wrapper"></cpt-psp-navigator>
          <cpt-psp-symbol-search id="desktop-search" [btn]="searchBtn" [placeholder]="'Search'"></cpt-psp-symbol-search>
        </div>
        <div class="col-2 col-lg-2 col-xl-3">
          <div #searchBtn (click)="toggleSearch();$event.stopPropagation()" class="header__button header__button--left"
               id="header_button--right">
            <img class="align-absolute" src="assets/imgs/icon_psp_search.svg">
          </div>
          <div #navBtn (click)="toggleNav();$event.stopPropagation()" class="header__button header__button--right">
            <img class="align-absolute" src="assets/imgs/ux__gear.svg">
          </div>
        </div>
      </div>
    </div>
    
    <!-- Onboarding Modal -->
    <cpt-psp-onboarding style="display:none;"></cpt-psp-onboarding>

    <!-- App Container -->
    <div class="container--main" id="container--main" [ngClass]="{'blur-me': searchOpened || navOpened.getValue()}">
      <!-- PANEL ROUTER - Health Check, Insights, My Stocks -->
      <div class="router__container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('navBtn') navBtn: ElementRef;
  @ViewChild('searchBtn') searchBtn: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const width = event.target.innerWidth;
    if (+width <= 992) this.menuPosition = 'left';
    if (+width > 992) this.menuPosition = 'right'
  }

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  searchOpened: boolean = false;
  navOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  title: string;
  status: PortfolioStatus;
  menuPosition: string;
  bsModalRef: BsModalRef;

  constructor(private router: Router,
              private cd: ChangeDetectorRef,
              private modalService: BsModalService,
              private healthCheck: HealthCheckService) {
    const mobWidth = (window.screen.width);
    if (+mobWidth <= 991) this.menuPosition = 'left';
    if (+mobWidth > 991) this.menuPosition = 'right';

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.title = event.urlAfterRedirects.replace(/\W/g, ' ').trim().split(' ')
          .map(str => {
            let cap = str.charAt(0).toUpperCase();
            return cap + str.slice(1);
          }).join(' ');
        gtag('config', 'UA-109763576-2', {
          'page_location': 'https://app.chaikinanalytics.com/ideas/' + event.urlAfterRedirects,
          'page_path': event.urlAfterRedirects
        });
      }
    });
    this.healthCheck.getPortfolioStatus()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.status = res);
  }

  ngOnInit() {
    const firstLogin = localStorage.getItem('first_login');
    if (JSON.parse(firstLogin) != false) {
      this.bsModalRef = this.modalService.show(PspOnboardingComponent);
    }
    localStorage.setItem('first_login', 'false');
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
