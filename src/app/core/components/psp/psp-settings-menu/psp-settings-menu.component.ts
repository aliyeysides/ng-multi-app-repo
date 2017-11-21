import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {BaseSettingsMenuComponent} from '../../../../shared/components/menus/settings-menu.component';
import {AuthService} from '../../../services/auth.service';
import {getBindingElementVariableDeclaration} from 'tslint';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-settings-menu',
  template: `
    <div (click)="openNav()" class="header__button header__button--left" id="header_button--left">
      <img class="align-absolute" src="assets/imgs/icon_sandwich.svg">
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
export class PspSettingsMenuComponent extends BaseSettingsMenuComponent {
  @ViewChild('nav') nav: ElementRef;

  @HostListener('click', ['$event']) onClick(e?: Event) {
    if (e) e.stopPropagation();
    this.openNav();
  }

  @HostListener('document:click', ['$event']) offClick(e: Event) {
    if (!this.el.nativeElement.contains(e.target)) this.closeNav();
  }

  constructor(public el: ElementRef,
              public authService: AuthService) {
    super(el, authService)
  }

  openNav() {
    this.nav.nativeElement.style.width = "320px";
    document.getElementById("header_button--right").style.display = "none";
    document.getElementById("header_button--left").style.left = "330px";
  }

  closeNav() {
    this.nav.nativeElement.style.width = "0";
    document.getElementById("header_button--right").style.display = "block";
    document.getElementById("header_button--left").style.left = "3%";
  }

}
