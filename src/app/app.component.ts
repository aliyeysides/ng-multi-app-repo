import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'cpt-root',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="navbar">
      <cpt-market-summary></cpt-market-summary>
      <cpt-bear-search></cpt-bear-search>
      <cpt-bear-alerts></cpt-bear-alerts>
      <cpt-bear-settings-menu></cpt-bear-settings-menu>
    </div>

    <div class="sidebar" [class.opened]="isOpen">
      <cpt-bear-brand></cpt-bear-brand>
      <cpt-bear-navigator></cpt-bear-navigator>
      <div class="side-nav__rule">
        <p>&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;</p>
      </div>
      <div class="nav-collapse" (click)="toggleMenu()">
        <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs></defs>
            <g id="icon_collapse" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path d="M230.75,150.5 C230.75,153.827303 229.384291,156.958882 227.043074,159.307566 L120.907939,265.78125 C118.566723,268.129934 115.445101,269.5 112.128378,269.5 C105.299831,269.5 99.6418919,263.824013 99.6418919,256.973684 L99.6418919,200.605263 L12.2364865,200.605263 C5.40793919,200.605263 -0.25,194.929276 -0.25,188.078947 L-0.25,112.921053 C-0.25,106.070724 5.40793919,100.394737 12.2364865,100.394737 L99.6418919,100.394737 L99.6418919,44.0263158 C99.6418919,37.1759868 105.299831,31.5 112.128378,31.5 C115.445101,31.5 118.566723,32.8700658 120.907939,35.21875 L227.043074,141.692434 C229.384291,144.041118 230.75,147.172697 230.75,150.5 Z M299.659511,81.25 L299.659511,218.75 C299.659511,249.804688 274.532642,275 243.562315,275 L181.232097,275 C177.920804,275 174.999075,272.070313 174.999075,268.75 C174.999075,263.28125 172.46691,250 181.232097,250 L243.562315,250 C260.703125,250 274.727424,235.9375 274.727424,218.75 L274.727424,81.25 C274.727424,64.0625 260.703125,50 243.562315,50 L187.465119,50 C182.59557,50 174.999075,50.9765625 174.999075,43.75 C174.999075,38.28125 172.46691,25 181.232097,25 L243.562315,25 C274.532642,25 299.659511,50.1953125 299.659511,81.25 Z" id="icon" transform="translate(150.000000, 150.000000) rotate(-180.000000) translate(-150.000000, -150.000000) "></path>
            </g>
          </svg>
        <a>Collapse Menu</a>
      </div>
    </div>

    <div class="container-fluid container-main">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isOpen = true;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
