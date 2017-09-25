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
    
    <div class="sidebar">
      <cpt-bear-brand></cpt-bear-brand>
      <cpt-bear-navigator></cpt-bear-navigator>
    </div>
    
    <div class="container-fluid container-main">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
