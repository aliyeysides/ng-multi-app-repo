import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseSettingsMenuComponent} from '../../../shared/components/menus/settings-menu.component';
import {AuthService} from '../../../services/auth.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-settings-menu',
  template: `
    <nav #nav class="container--nav">
      <div class="logo">
        <img src="assets/imgs/logo_powerpulse.svg">
      </div>
      <div class="nav-list">
        <cpt-psp-navigator (routeClicked)="navClicked()"></cpt-psp-navigator>
        <ul>
          <li>
            <a href="https://www.chaikinanalytics.com/tag/education/" class="nav--toplevel"><i class="fa fa-graduation-cap" aria-hidden="true"></i> &nbsp;Education</a>
          </li>
        </ul>
        <ul>
          <li>
            <a class="nav--toplevel"><i class="fa fa-cogs" aria-hidden="true"></i> &nbsp;Settings</a>
          </li>
          <li class="row no-gutters sub-nav" style="">
            <div class="col-12">
              <a href="https://www.chaikinanalytics.com/stock-rating/" class="nav--sublevel" target="_blank"><i class="fa fa-cog" aria-hidden="true"></i> About the Power Gauge</a>
            </div>
            <div class="col-6">
              <a href="" class="nav--sublevel" target="_blank"><i class="fa fa-cog" aria-hidden="true"></i> Walkthrough</a>
            </div>
            <div class="col-6">
             <a href="https://www.chaikinanalytics.com/chaikin-powerpulse-user-guide/" class="nav--sublevel" target="_blank"><i class="fa fa-cog" aria-hidden="true"></i> User Guide</a>
            </div>
            <div class="col-6">
              <a href="https://mh214.infusionsoft.com/app/orderForms/Chaikin-Analytics---Annual-Subscription" class="nav--sublevel" target="_blank"><i class="fa fa-cog" aria-hidden="true"></i> Upgrade!</a>
            </div>
            <div class="col-6">
              <a href="https://mh214.infusionsoft.com/app/form/pp_cancel" class="nav--sublevel" target="_blank"><i class="fa fa-cog" aria-hidden="true"></i> Manage Subscription</a>
            </div>
            <div class="col-6">
             <a href="https://mh214.infusionsoft.com/app/form/pp_changelogin" class="nav--sublevel" target="_blank"><i class="fa fa-cog" aria-hidden="true"></i> Edit User Name</a>
            </div>
            <div class="col-6">
              <a href="mailto:info@chaikinanalytics.com?subject=PowerPulse support request" class="nav--sublevel" target="_blank"><i class="fa fa-cog" aria-hidden="true"></i> Contact Us</a>
            </div>
          </li>
        </ul>
        <ul>
          <li (click)="logOutSession()">
            <a class="nav--toplevel"><i class="fa fa-user-times" aria-hidden="true"></i> &nbsp;Sign Out</a>
          </li>
        </ul>
      </div>
      <div class="container-fluid toc__container">
        <div class="row" style="">
          <div class="col-6">
            <p><a class="toc__link" href="https://www.chaikinanalytics.com/terms/" target="_blank">Terms &amp; Conditions</a></p>
          </div>
          <div class="col-6">
            <p class="version">PowerPulse V1</p>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./psp-settings-menu.component.scss']
})
export class PspSettingsMenuComponent extends BaseSettingsMenuComponent implements OnInit {
  private _btn: HTMLElement;
  @Input('navOpened') navOpened: BehaviorSubject<boolean>;
  @Input('btn')
  set btn(val: HTMLElement) {
    this._btn = val;
  }

  get btn() {
    return this._btn;
  }

  @Output('navClosed') navClosed: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('nav') nav: ElementRef;

  @HostListener('click', ['$event']) onClick(e?: Event) {
    if (e) e.stopPropagation();
  }

  @HostListener('document:click', ['$event']) offClick(e: Event) {
    e.stopPropagation();
    if (!this.el.nativeElement.contains(e.target) && !this.btn.contains(e.target as Node)) {
      this.closeNav();
      this.navClicked();
    }
  }

  private opened: boolean = false;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public el: ElementRef,
              public authService: AuthService) {
    super(el, authService);
  }

  ngOnInit() {
    this.navOpened
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => res === false ? this.closeNav() : this.openNav())
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  openNav() {
    this.opened = true;
    this.nav.nativeElement.style.width = "320px";
    document.getElementById("header_button--right").style.right = "-335px";
    document.getElementById("header_button--left").style.left = "335px";
  }

  closeNav() {
    this.opened = false;
    this.nav.nativeElement.style.width = "0";
    document.getElementById("header_button--right").style.right = "1em";
    document.getElementById("header_button--left").style.left = "1em";
  }

  navClicked() {
    this.navClosed.emit();
  }

}
