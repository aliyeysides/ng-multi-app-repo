import {
  ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NavigationEnd, Router, ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {HealthCheckService} from '../services/health-check.service';
import {PortfolioStatus} from '../shared/models/health-check';
import {Subject} from 'rxjs/Subject';
import {PspOnboardingComponent} from './core/psp-onboarding/psp-onboarding.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ReportService} from '../services/report.service';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-root',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
  template: `
    <!-- PANEL HEADER - Fixed to the top of each panel-->
    <div cptStockPgrColor [stock]="currentStock" [status]="status" class="page__header"
         [ngClass]="{'page__header--green': status?.avgPercentageChange>0 && !currentStock, 'page__header--red': status?.avgPercentageChange<0 && !currentStock}"
         id="page__header">
         
      <div #navBtn (click)="toggleNav();$event.stopPropagation()" class="header__button header__button--left" id="header_button--left">
        <i class="fal fa-bars"></i>
      </div>

      <cpt-psp-settings-menu [side]="menuPosition" [btn]="navBtn" [navOpened]="navOpened"
                             (navClosed)="navOpened.next(false)"></cpt-psp-settings-menu>

      <div class="header__title header__search">
        <h1 *ngIf="!searchOpened">{{ title }}</h1>
        <cpt-psp-symbol-search id="mobile-search" [btn]="searchBtn" (toggleSearch)="toggleSearch()" [placeholder]="'Search'"
                               *ngIf="searchOpened"></cpt-psp-symbol-search>
      </div>

      <div #searchBtn (click)="toggleSearch();$event.stopPropagation()" class="header__button header__button--right" id="header_button--right">
        <i class="fal fa-search"></i>
      </div>
    </div>


    <!-- DESKTOP HEADER -->
        <div class="page__header--desktop container-fluid">
<!--     <div class="page__header--desktop container-fluid"
      [ngClass]="{'page__header--green': status?.avgPercentageChange>0, 'page__header--red': status?.avgPercentageChange<0}" > -->

      <!-- SECOND HEADER-->
      <div class="row header--second justify-content-center">
        <!-- LOGO-->
        <div class="col-3 col-xl-3 logo--desktop">
          <img class="float-left hidden-md-down" src="assets/imgs/logo_powerpulse--desktop.svg">
          <img class="float-left hidden-lg-up" src="assets/imgs/logo_powerpulse--icon.svg">
        </div>
        <div class="col-8 col-xl-6 header__nav">
          <cpt-psp-navigator *ngIf="!searchOpened" class="desktop-nav" id="desktop-nav__wrapper"></cpt-psp-navigator>
        </div>
        <div class="col-1 col-xl-3"></div>
        <div #navBtn (click)="toggleNav();$event.stopPropagation()" class="header__button header__button--right">
          <i class="fal fa-cog fa-spin-hover"></i>
        </div>
      </div>

      <!-- FIRST HEADER -->
      <div class="row header--first justify-content-center">
        <!-- SEARCH -->
        <div class="col-6 col-lg-5 col-xl-4 search--desktop">
          <cpt-psp-symbol-search id="desktop-search" [btn]="searchBtn" [placeholder]="'Search'"></cpt-psp-symbol-search>
        </div>
        <!-- MARKETS -->
        <div class="col-6 col-lg-7 col-xl-8 markets--desktop">
          <cpt-psp-market-summary></cpt-psp-market-summary>
        </div>
      </div>



    </div>
    <!-- END DESKTOP HEADER -->

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
  currentStock: string;
  bsModalRef: BsModalRef;

  constructor(private router: Router,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute,
              private reportService: ReportService,
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
        if (this.title === 'Health Check' || this.title === 'Market Insights') this.currentStock = undefined;
        gtag('config', 'UA-109763576-2', {
          'page_location': 'https://app.chaikinanalytics.com/ideas/' + event.urlAfterRedirects,
          'page_path': event.urlAfterRedirects
        });
      }
    });

    this.healthCheck.getPortfolioStatus()
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.status = res);

    this.reportService.selectedSymbol$.subscribe(stock => this.currentStock = stock);
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
