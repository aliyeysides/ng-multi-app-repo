import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-bear-brand',
  template: `
      <div class="sidebar__logo sidebar__logo--open">
        <img class="align-absolute" src="./assets/imgs/logo_bear.svg" alt="logo">
        <img class="logo__CA align-absolute" src="./assets/imgs/logo_poweredby-CA.svg" alt="logo">
      </div>
      <div class="sidebar__logo sidebar__logo--collapsed">
        <img class="align-absolute" src="./assets/imgs/logo_bear--collapsed.png" alt="logo">
      </div>
  `,
  styleUrls: ['./bear-brand.component.scss']
})
export class BearBrandComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
