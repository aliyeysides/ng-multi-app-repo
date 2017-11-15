import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {BaseSettingsMenuComponent} from '../../base/settings-menu.component';
import {AuthService} from '../../../services/auth.service';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-settings-menu',
  template: `    
    <a class="quick-link">
      <div class="header__toggle quick-link">
        <img src="assets/imgs/icon_sandwich.svg">
      </div>
    </a>
    <!-- PANEL - Navigation - This sits below everything -->
    <div #nav class="container--nav">
      <div class="logo">
        <img src="assets/imgs/logo_powerpulse.svg">
      </div>
      <div class="nav-list">
        <cpt-psp-navigator></cpt-psp-navigator>
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
    </div>
  `,
  styleUrls: ['./psp-settings-menu.component.scss']
})
export class PspSettingsMenuComponent extends BaseSettingsMenuComponent {
  @ViewChild('nav') nav: ElementRef;

  constructor(public el: ElementRef,
              public authService: AuthService) {
    super(el, authService)
  }
}
