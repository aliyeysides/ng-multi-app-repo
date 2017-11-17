import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {BaseSettingsMenuComponent} from '../../base/settings-menu.component';
import {AuthService} from '../../../services/auth.service';
import {getBindingElementVariableDeclaration} from 'tslint';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-settings-menu',
  template: `
    <div (click)="openNav()" class="header__button header__button--left">
      <img class="align-middle" src="assets/imgs/icon_sandwich.svg">
    </div>
    <!--PANEL - Navigation - This sits below everything -->
    <nav #nav class="container--nav">
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
    </nav>
  `,
  styleUrls: ['./psp-settings-menu.component.scss']
})
export class PspSettingsMenuComponent {
  @ViewChild('nav') nav: ElementRef;

  @HostListener('document:click', ['$event']) offClick(e: Event) {
    if (!this.el.nativeElement.contains(e.target)) this.closeNav();
  }

  constructor(private el: ElementRef,
              private authService: AuthService) {
  }

  openNav() {
    this.nav.nativeElement.style.width = "320px";
    document.getElementById("container--main").style.marginLeft = "320px";
  }

  closeNav() {
    this.nav.nativeElement.style.width = "0";
    document.getElementById("container--main").style.marginLeft = "0";
  }

}
