import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'cpt-bear-alerts',
  template: `
    <a class="quick-link">
      <svg class="align-absolute"  width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs></defs>
        <g id="icon_alerts" fill="#000000" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path
              d="M153,283 C153,281.833333 151.833333,280.666667 150,281 C137.166667,280.666667 126.333333,269.833333 126,257 C126.333333,255.166667 125.166667,254 124,254 C122.166667,254 121,255.166667 121,257 C121,272.833333 134.166667,286 150,286 C151.833333,286 153,284.833333 153,283 Z M289,236 C289,247.433036 279.310096,257.142857 268,257 L193,257 C192.769231,280.747768 173.55649,300 150,300 C126.44351,300 107.230769,280.747768 107,257 L32,257 C20.6899038,257.142857 11,247.433036 11,236 C35.7259615,214.787946 64.4615385,177.287946 64,96 C64.4615385,64.2857143 91.0252404,29.1294643 135,23 C134.46274,20.5915179 133.961538,18.4151786 134,16 C133.961538,7.19866071 141.145433,0 150,0 C158.854567,0 166.038462,7.19866071 166,16 C166.038462,18.4151786 165.53726,20.5915179 165,23 C208.97476,29.1294643 235.538462,64.2857143 236,96 C235.538462,177.287946 264.274038,214.787946 289,236 Z"
              id="icon"></path>
        </g>
      </svg>
    </a>
    <div #nav id="notificationSideNav" class="sidenav">

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
        <h1>Notifications</h1>
      </div>

    </div>
  `,
  styleUrls: ['./bear-alerts.component.scss']
})
export class BearAlertsComponent implements OnInit {
  @ViewChild('nav') nav;

  @HostListener('click') onClick() {
    this.toggleNav(this.nav.nativeElement, '500px', true);
  }
  @HostListener('document:click', ['$event']) offClick(e: Event) {
    if (!this.el.nativeElement.contains(e.target)) this.toggleNav(this.nav.nativeElement, '0', false);
  }

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
  }

  public toggleNav(el: HTMLElement, size: string, darken: boolean): void {
    el.style.width = size;
    if (darken === true) {
      document.getElementById('alerts-darken').style.visibility = 'visible';
    } else if (darken === false) {
      document.getElementById('alerts-darken').style.visibility = 'hidden';
    }
  }
}
