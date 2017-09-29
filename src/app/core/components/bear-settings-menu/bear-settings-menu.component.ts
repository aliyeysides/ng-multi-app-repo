import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {noop} from 'rxjs/util/noop';

@Component({
  selector: 'cpt-bear-settings-menu',
  template: `
    <a class="quick-link">
      <svg class="align-absolute" width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs></defs>
        <g id="icon_gear" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path d="M149,216 C112.24,216.435 83,185.52 83,149 C83,113.7 112.24,84 149,84 C185.136,84 214.512,113.7 215,149 C214.512,185.52 185.136,216.435 149,216 M285,119 L256,113 C254.211957,108.16787 254.211957,104.106498 252,101 L269,77 C274.184783,67.8249097 271.73913,59.0252708 266,53 L248,34 C244.836957,31.0018051 240.081522,29.9187726 234,30 C230.706522,29.9187726 227.173913,31.0018051 224,33 L200,49 C196.059783,46.299639 191.983696,43.8628159 189,44 L182,15 C179.619565,8.25812274 172.554348,0 163,0 L137,0 C128.532609,0 121.467391,8.25812274 119,15 L113,44 C108.559783,43.8628159 104.483696,46.299639 101,49 L76,33 C74.5923913,31.0018051 69.2934783,29.9187726 66,30 C61.6847826,29.9187726 56.3858696,31.0018051 53,34 L34,53 C28.125,59.0252708 27.5815217,67.8249097 32,77 L48,101 C47.5543478,104.106498 45.1086957,108.16787 43,113 L14,119 C6.52173913,119.945848 0,129.287004 0,137 L0,162 C0,171.931408 6.52173913,180.189531 14,181 L43,187 C45.1086957,190.749097 47.5543478,194.810469 48,199 L32,224 C27.5815217,229.873646 28.125,239.756318 34,246 L53,264 C56.3858696,268.998195 61.6847826,269.67509 66,270 C69.2934783,269.67509 74.5923913,269.67509 76,267 L101,251 C104.483696,252.617329 108.559783,253.83574 113,257 L119,285 C121.467391,293.637184 128.532609,300 137,300 L163,300 C172.554348,300 179.619565,293.637184 182,285 L189,257 C191.983696,253.83574 196.059783,252.617329 200,251 L224,267 C227.173913,269.67509 230.706522,269.67509 234,270 C240.081522,269.67509 244.836957,268.998195 248,264 L266,246 C271.73913,239.756318 274.184783,229.873646 269,224 L252,199 C254.211957,194.810469 254.211957,190.749097 256,187 L285,181 C294.021739,180.189531 300,171.931408 300,162 L300,137 C300,129.287004 294.021739,119.945848 285,119" id="icon"></path>
        </g>
    </svg>
    </a>
    <div #nav id="settingsSideNav" class="sidenav">

      <div class="right-sidebar__header">
        <a href="javascript:void(0)" class="closebtn" (click)="toggleNav(nav, '0', false);$event.stopPropagation()">&times;</a>
        <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs></defs>
          <g id="icon_search" fill="#ffffff" stroke="none" stroke-width="1" fill-rule="evenodd">
            <path
              d="M63.2722536,179.567981 C65.0525837,181.763213 66.9619831,183.906719 69,186 C85.3600138,201.928094 104.787833,210 128,210 C150.212167,210 169.639986,201.928094 186,186 C201.928094,169.639986 210,150.212167 210,127 C210,104.787833 201.928094,85.3600138 186,69 C169.639986,53.0719059 150.212167,45 128,45 C104.787833,45 85.3600138,53.0719059 69,69 C53.0719059,85.3600138 45,104.787833 45,127 C45,138.858684 47.1067729,149.729651 51.2915549,159.708445 L89,122 C90.3054245,120.945946 91.9209906,120.945946 93,122 L112,141 L149,103 L139,93 C137.803066,91.7567568 139.014741,89 141,89 L176,89 C177.869104,89 179,90.1351351 179,92 L179,127 C179,129.135135 176.253538,130.351351 175,129 L165,119 L114,170 C112.600236,171.216216 110.98467,171.216216 110,170 L91,151 L63.2722536,179.567981 Z M293,293 C288.581708,297.716369 283.173108,300 277,300 C270.43266,300 265.02406,297.716369 261,293 L199,231 C177.343642,246.394305 153.365517,253.846154 127,254 C109.735491,253.846154 93.2993573,250.510851 78,244 C61.9290081,237.169438 48.4075087,228.155105 37,217 C25.691049,205.438645 16.676716,191.917146 10,176 C3.33530319,160.546797 0,144.110663 0,127 C0,109.735491 3.33530319,93.2993573 10,78 C16.676716,61.9290081 25.691049,48.4075087 37,37 C48.4075087,25.691049 61.9290081,16.676716 78,10 C93.2993573,3.33530319 109.735491,0 127,0 C144.110663,0 160.546797,3.33530319 176,10 C191.917146,16.676716 205.438645,25.691049 217,37 C228.155105,48.4075087 237.169438,61.9290081 244,78 C250.510851,93.2993573 253.846154,109.735491 254,127 C253.846154,153.365517 246.394305,177.343642 231,199 L293,261 C297.776465,265.144253 300,270.552853 300,277 C300,283.173108 297.716369,288.581708 293,293 Z"></path>
          </g>
        </svg>
        <h1>Settings</h1>
        <ul>
          <li *ngFor="let choice of items" (click)="choice.fn();">
            <a href="{{choice.href}}" target="{{choice.target}}"><i class="{{choice.icon}}" aria-hidden="true"></i>&nbsp; {{choice.title}}</a>
          </li>
        </ul>
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
    // { title: 'Quickstart', icon: 'fa fa-book', href: '#', target: '', fn: this.relaunchOnboarding.bind(this) },
    {
      title: 'Upgrade',
      icon: 'fa fa-upload',
      href: 'https://mh214.infusionsoft.com/app/orderForms/Chaikin-Analytics---Annual-Subscription',
      target: '_blank',
      fn: noop
    },
    {
      title: 'User guide',
      icon: 'fa fa-book',
      href: 'https://www.chaikinanalytics.com/analytics-resource-guide/',
      target: '_blank',
      fn: noop
    },
    {
      title: 'Support/Contact',
      icon: 'fa fa-life-ring',
      href: '#',
      target: '',
      fn: noop
    },
    {
      title: 'Log out',
      icon: 'fa fa-user-times',
      href: '#',
      target: '',
      fn: this.logOutSession.bind(this)
    }
  ];

  constructor(private el: ElementRef) {
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
    // this.authService.logOutSession()
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe();
  }
}
