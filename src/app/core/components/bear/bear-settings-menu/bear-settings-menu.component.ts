import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Subject} from 'rxjs/Subject';

declare let gtag: Function;

@Component({
  selector: 'cpt-bear-settings-menu',
  template: `
    <a class="quick-link">
      <svg class="align-absolute" width="300px" height="300px" viewBox="0 0 300 300" version="1.1"
           xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs></defs>
        <g id="icon_gear" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
          <path
            d="M149,216 C112.24,216.435 83,185.52 83,149 C83,113.7 112.24,84 149,84 C185.136,84 214.512,113.7 215,149 C214.512,185.52 185.136,216.435 149,216 M285,119 L256,113 C254.211957,108.16787 254.211957,104.106498 252,101 L269,77 C274.184783,67.8249097 271.73913,59.0252708 266,53 L248,34 C244.836957,31.0018051 240.081522,29.9187726 234,30 C230.706522,29.9187726 227.173913,31.0018051 224,33 L200,49 C196.059783,46.299639 191.983696,43.8628159 189,44 L182,15 C179.619565,8.25812274 172.554348,0 163,0 L137,0 C128.532609,0 121.467391,8.25812274 119,15 L113,44 C108.559783,43.8628159 104.483696,46.299639 101,49 L76,33 C74.5923913,31.0018051 69.2934783,29.9187726 66,30 C61.6847826,29.9187726 56.3858696,31.0018051 53,34 L34,53 C28.125,59.0252708 27.5815217,67.8249097 32,77 L48,101 C47.5543478,104.106498 45.1086957,108.16787 43,113 L14,119 C6.52173913,119.945848 0,129.287004 0,137 L0,162 C0,171.931408 6.52173913,180.189531 14,181 L43,187 C45.1086957,190.749097 47.5543478,194.810469 48,199 L32,224 C27.5815217,229.873646 28.125,239.756318 34,246 L53,264 C56.3858696,268.998195 61.6847826,269.67509 66,270 C69.2934783,269.67509 74.5923913,269.67509 76,267 L101,251 C104.483696,252.617329 108.559783,253.83574 113,257 L119,285 C121.467391,293.637184 128.532609,300 137,300 L163,300 C172.554348,300 179.619565,293.637184 182,285 L189,257 C191.983696,253.83574 196.059783,252.617329 200,251 L224,267 C227.173913,269.67509 230.706522,269.67509 234,270 C240.081522,269.67509 244.836957,268.998195 248,264 L266,246 C271.73913,239.756318 274.184783,229.873646 269,224 L252,199 C254.211957,194.810469 254.211957,190.749097 256,187 L285,181 C294.021739,180.189531 300,171.931408 300,162 L300,137 C300,129.287004 294.021739,119.945848 285,119"
            id="icon"></path>
        </g>
      </svg>
    </a>
    <div #nav id="settingsSideNav" class="sidenav">

      <div class="right-sidebar__header">
        <a href="javascript:void(0)" class="closebtn" (click)="toggleNav(nav, '0', false);$event.stopPropagation()">&times;</a>
        <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs></defs>
          <g id="icon_gear" fill="#ffffff" stroke="none" stroke-width="1" fill-rule="evenodd">
            <path
              d="M149,216 C112.24,216.435 83,185.52 83,149 C83,113.7 112.24,84 149,84 C185.136,84 214.512,113.7 215,149 C214.512,185.52 185.136,216.435 149,216 M285,119 L256,113 C254.211957,108.16787 254.211957,104.106498 252,101 L269,77 C274.184783,67.8249097 271.73913,59.0252708 266,53 L248,34 C244.836957,31.0018051 240.081522,29.9187726 234,30 C230.706522,29.9187726 227.173913,31.0018051 224,33 L200,49 C196.059783,46.299639 191.983696,43.8628159 189,44 L182,15 C179.619565,8.25812274 172.554348,0 163,0 L137,0 C128.532609,0 121.467391,8.25812274 119,15 L113,44 C108.559783,43.8628159 104.483696,46.299639 101,49 L76,33 C74.5923913,31.0018051 69.2934783,29.9187726 66,30 C61.6847826,29.9187726 56.3858696,31.0018051 53,34 L34,53 C28.125,59.0252708 27.5815217,67.8249097 32,77 L48,101 C47.5543478,104.106498 45.1086957,108.16787 43,113 L14,119 C6.52173913,119.945848 0,129.287004 0,137 L0,162 C0,171.931408 6.52173913,180.189531 14,181 L43,187 C45.1086957,190.749097 47.5543478,194.810469 48,199 L32,224 C27.5815217,229.873646 28.125,239.756318 34,246 L53,264 C56.3858696,268.998195 61.6847826,269.67509 66,270 C69.2934783,269.67509 74.5923913,269.67509 76,267 L101,251 C104.483696,252.617329 108.559783,253.83574 113,257 L119,285 C121.467391,293.637184 128.532609,300 137,300 L163,300 C172.554348,300 179.619565,293.637184 182,285 L189,257 C191.983696,253.83574 196.059783,252.617329 200,251 L224,267 C227.173913,269.67509 230.706522,269.67509 234,270 C240.081522,269.67509 244.836957,268.998195 248,264 L266,246 C271.73913,239.756318 274.184783,229.873646 269,224 L252,199 C254.211957,194.810469 254.211957,190.749097 256,187 L285,181 C294.021739,180.189531 300,171.931408 300,162 L300,137 C300,129.287004 294.021739,119.945848 285,119"
              id="icon"></path>
          </g>
        </svg>
        <h3>Settings</h3>
      </div>

      <div class="settings__container">
        <ul>
          <li *ngFor="let choice of items" (click)="choice.fn();">
            <a href="{{choice.href}}" target="{{choice.target}}"><i class="{{choice.icon}}" aria-hidden="true"></i>&nbsp;
              {{choice.title}}</a>
          </li>
        </ul>
        <div class="terms__container">
          <p> <a href="http://www.masteringthebear.com/terms-and-conditions" target="_blank">Terms &amp; Conditions</a> <span> | </span> <a href="http://www.masteringthebear.com/attributions/" target="_blank">Attributions</a> </p>
        </div>
      </div>

    </div>
  `,
  styleUrls: ['./bear-settings-menu.component.scss']
})
export class BearSettingsMenuComponent implements OnInit {
  @ViewChild('nav') nav;

  @HostListener('click') onClick() {
    this.toggleNav(this.nav.nativeElement, '500px', true);
  }

  @HostListener('document:click', ['$event']) offClick(e: Event) {
    if (!this.el.nativeElement.contains(e.target)) this.toggleNav(this.nav.nativeElement, '0', false);
  }

  public items: object[] = [
    {
      title: 'User guide',
      icon: 'fa fa-book',
      href: 'http://www.masteringthebear.com/user-guide',
      target: '_blank',
      fn: () => {
        gtag('event', 'user_guide_clicked');
      }
    },
    {
      title: 'Edit User Name',
      icon: 'fa fa-pencil-square-o',
      href: 'https://mh214.infusionsoft.com/app/form/email_loginid_change',
      target: '_blank',
      fn: () => {
        gtag('event', 'edit_user_name_clicked');
      }
    },
    {
      title: 'Upgrade',
      icon: 'fa fa-upload',
      href: 'https://mh214.infusionsoft.com/app/form/bear_upgrade-form',
      target: '_blank',
      fn: () => {
        gtag('event', 'upgrade_clicked');
      }
    },
    {
      title: 'Modify Subscription',
      icon: 'fa fa-ban',
      href: 'https://mh214.infusionsoft.com/app/form/ber_cancellation_form',
      target: '_blank',
      fn: () => {
        gtag('event', 'modify_sub_clicked');
      }
    },
    {
      title: 'Contact Us',
      icon: 'fa fa-life-ring',
      href: 'mailto:info@chaikinanalytics.com?subject="Mastering the Bear support request" ',
      target: '',
      fn: () => {
        gtag('event', 'contact_us_clicked');
      }
    },
    {
      title: 'Log out',
      icon: 'fa fa-user-times',
      href: '#',
      target: '',
      fn: this.logOutSession.bind(this)
    }
  ];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private el: ElementRef,
              private authService: AuthService) {
  }

  ngOnInit() {
  }

  public toggleNav(el: HTMLElement, size: string, darken: boolean): void {
    el.style.width = size;
    if (darken === true) {
      document.getElementById('settings-darken').style.visibility = 'visible';
    } else if (darken === false) {
      document.getElementById('settings-darken').style.visibility = 'hidden';
    }
  }

  public logOutSession(): void {
    gtag('event', 'logout_clicked');
    this.authService.logOutSession()
      .takeUntil(this.ngUnsubscribe)
      .subscribe();
  }
}
