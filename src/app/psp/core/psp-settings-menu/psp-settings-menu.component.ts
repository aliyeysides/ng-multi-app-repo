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
            <a><i class="fa fa-cogs" aria-hidden="true"></i> &nbsp;Settings</a>
          </li>
        </ul>
        <ul>
          <li (click)="logOutSession()">
            <a><i class="fa fa-user-times" aria-hidden="true"></i> &nbsp;Sign Out</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styleUrls: ['./psp-settings-menu.component.scss']
})
export class PspSettingsMenuComponent extends BaseSettingsMenuComponent implements OnInit {
  @Input('navOpened') navOpened: BehaviorSubject<boolean>;
  @Input('btn') btn: ElementRef;
  @Output('navClosed') navClosed: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('nav') nav: ElementRef;

  @HostListener('click', ['$event']) onClick(e?: Event) {
    if (e) e.stopPropagation();
  }

  @HostListener('document:click', ['$event']) offClick(e: Event) {
    // e.stopPropagation();
    // console.log('el', this.el.nativeElement, 'btn', this.btn.nativeElement);
    //   if (!this.el.nativeElement.contains(e.target) && !this.btn.nativeElement.contains(e.target)) this.closeNav();
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
