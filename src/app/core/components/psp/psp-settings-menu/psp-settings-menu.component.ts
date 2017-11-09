import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {BearSettingsMenuComponent} from '../../bear/bear-settings-menu/bear-settings-menu.component';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-settings-menu',
  template: `
    <div class="header__toggle">
      <img src="assets/imgs/icon_sandwich.svg">
    </div>

    <!-- PANEL - Navigation - This sits below everything -->
    <div #nav class="container--nav">
      <div class="logo">
        <img src="assets/imgs/logo_powerpulse.svg">
      </div>
      <div class="nav-list">
        <cpt-psp-navigator></cpt-psp-navigator>
        <!--<ul>-->
          <!--<li>-->
            <!--<a><i class="fa fa-tachometer" aria-hidden="true"></i> &nbsp;Health Check</a>-->
          <!--</li>-->
          <!--<li>-->
            <!--<a><i class="fa fa-list" aria-hidden="true"></i> &nbsp;My Stocks</a>-->
          <!--</li>-->
          <!--<li>-->
            <!--<a><i class="fa fa-heartbeat" aria-hidden="true"></i> &nbsp;Market Beat</a>-->
          <!--</li>-->
        <!--</ul>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<a><i class="fa fa-cogs" aria-hidden="true"></i> &nbsp;Settings</a>-->
          <!--</li>-->
        <!--</ul>-->
        <!--<ul>-->
          <!--<li>-->
            <!--<a><i class="fa fa-user-times" aria-hidden="true"></i> &nbsp;Sign Out</a>-->
          <!--</li>-->
        <!--</ul>-->
      </div>
    </div>
  `,
  styleUrls: ['./psp-settings-menu.component.scss']
})
export class PspSettingsMenuComponent extends BearSettingsMenuComponent {

  // @ViewChild('nav') nav: ElementRef;
  //
  // @HostListener('click') onClick() {
  //   this.toggleNav(this.nav.nativeElement, '500px', true);
  // }
  //
  // @HostListener('document:click', ['$event']) offClick(e: Event) {
  //   if (!this.el.nativeElement.contains(e.target)) this.toggleNav(this.nav.nativeElement, '0', false);
  // }
  //
  //
  // constructor(private el: ElementRef) {
  // }
  //
  // ngOnInit() {
  // }
  //
  // public toggleNav(el: HTMLElement, size: string, darken: boolean): void {
  //   console.log('fired');
  //   el.style.width = size;
  //   if (darken === true) {
  //     document.getElementById('settings-darken').style.visibility = 'visible';
  //   } else if (darken === false) {
  //     document.getElementById('settings-darken').style.visibility = 'hidden';
  //   }
  // }

}
