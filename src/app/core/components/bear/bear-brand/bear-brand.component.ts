import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-bear-brand',
  template: `
      <div class="sidebar__logo sidebar__logo--open">
        <img class="align-absolute" src="./assets/imgs/logo-chaikin-W.svg" alt="logo">
      </div>
      <div class="sidebar__logo sidebar__logo--collapsed">
        <img class="align-absolute" src="./assets/imgs/logo-chaikin-arch.svg" alt="logo">
      </div>
      <div class="tagline">
        <p>Mastering The Bear</p>
      </div>
  `,
  styleUrls: ['./bear-brand.component.scss']
})
export class BearBrandComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
