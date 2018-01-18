import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseSettingsMenuComponent} from '../../../shared/components/menus/settings-menu.component';
import {AuthService} from '../../../services/auth.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PspOnboardingComponent} from '../psp-onboarding/psp-onboarding.component';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-settings-menu',
  template: `
    <nav [ngStyle]="{'left': side == 'left' ? 0 : null}" #nav class="container--nav">
      <div class="logo hidden-lg-up">
        <img src="assets/imgs/logo_powerpulse.svg">
      </div>
      <div class="nav-list">
        <!-- MAIN NAV -->
        <cpt-psp-navigator class="hidden-lg-up" *ngIf="side==='left'" (routeClicked)="navClicked()"></cpt-psp-navigator>
        <div class="hidden-md-down" style="height:30px;"></div>
        <!-- EDUCATION -->
        <ul>
          <li>
            <a (click)="gtagClicked('education_clicked')" target="_blank" href="https://www.chaikinanalytics.com/tag/education/" class="nav--toplevel"><i class="fal fa-graduation-cap" aria-hidden="true"></i> &nbsp;Education</a>
          </li>
        </ul>
        <!-- UPGRADE -->
        <ul class="hidden-md-down">
          <li>
            <a (click)="gtagClicked('upgrade_clicked')" href="https://www.chaikinanalytics.com/powerpulse-upgrade/" class="nav--toplevel" target="_blank"><i class="fal fa-star" aria-hidden="true"></i> &nbsp;Upgrade</a>
          </li>
        </ul>
        <!-- SETTING -->
        <ul>
          <li>
            <a class="nav--toplevel" style="cursor:default;"><i class="fal fa-cogs" aria-hidden="true"></i> &nbsp;Settings</a>
          </li>
          <li class="row no-gutters sub-nav">
            <div class="col-12">
              <a (click)="gtagClicked('about_rating_clicked')" href="https://www.chaikinanalytics.com/stock-rating/" class="nav--sublevel" target="_blank"><i class="fal fa-cog" aria-hidden="true"></i> About the Power Gauge</a>
            </div>
            <div class="col-6 col-lg-12">
              <a (click)="startOnboarding();gtagClicked('onboarding_clicked')" class="nav--sublevel"><i class="fal fa-cog" aria-hidden="true"></i> Walkthrough</a>
            </div>
            <div class="col-6 col-lg-12">
             <a (click)="gtagClicked('user_guide_clicked')" href="https://www.chaikinanalytics.com/chaikin-powerpulse-user-guide/" class="nav--sublevel" target="_blank"><i class="fal fa-cog" aria-hidden="true"></i> User Guide</a>
            </div>
            <div class="col-6 col-lg-12">
              <a (click)="gtagClicked('manage_subscription_clicked')" href="https://mh214.infusionsoft.com/app/form/pp_cancel" class="nav--sublevel" target="_blank"><i class="fal fa-cog" aria-hidden="true"></i> Manage Subscription</a>
            </div>
            <div class="col-6 col-lg-12">
             <a (click)="gtagClicked('edit_user_name_clicked')" href="https://mh214.infusionsoft.com/app/form/pp_changelogin" class="nav--sublevel" target="_blank"><i class="fal fa-cog" aria-hidden="true"></i> Edit User Name</a>
            </div>
            <div class="col-6 col-lg-12">
              <a (click)="gtagClicked('contact_us_clicked')" href="mailto:info@chaikinanalytics.com?subject=PowerPulse support request" class="nav--sublevel" target="_blank"><i class="fal fa-cog" aria-hidden="true"></i> Contact Us</a>
            </div>
          </li>
        </ul>
        <!-- SIGN OUT -->
        <ul>
          <li (click)="logOutSession()">
            <a class="nav--toplevel"><i class="fal fa-user-times" aria-hidden="true"></i> &nbsp;Sign Out</a>
          </li>
        </ul>
      </div>
      <!-- TERMS AND CONDITIONS -->
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
  @Input('side') side: string;
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

  bsModalRef: BsModalRef;

  constructor(public el: ElementRef,
              public authService: AuthService,
              private modalService: BsModalService) {
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

  startOnboarding() {
    this.bsModalRef = this.modalService.show(PspOnboardingComponent);
    this.navClosed.emit();
  }

  gtagClicked(event: string) {
    gtag('event', event);
  }

}
