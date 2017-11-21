import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'cpt-psp-search-btn',
  template: `
    <div (click)="toggleSearch()" class="header__button header__button--right">
      <img src="assets/imgs/icon_psp_search.svg">
    </div>
  `,
  styleUrls: ['./psp-search-btn.component.scss']
})
export class PspSearchBtnComponent {
  @Output('toggleSearchClicked') toggleSearchClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  toggleSearch() {
    this.toggleSearchClicked.emit();
  }

}
